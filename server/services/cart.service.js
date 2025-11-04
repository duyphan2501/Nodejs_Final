import mongoose from "mongoose";
import redisClient from "../config/init.redis.js";
// import { formatCartItemInfo } from "../helpers/cart.helper.js";
import CartModel from "../models/cart.model.js";
import VariantModel from "../models/variant.model.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 4; // 4 ngày

const addCartItem = async (userId, guestCartId, item, quantity) => {
  if (quantity === 0) return;

  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyInfo = `${cartKey}:info`;
  const cartKeyQty = `${cartKey}:qty`;

  const TTL = userId ? USER_CART_TTL : GUEST_CART_TTL;

  const productKey = `product:${item.variantId}:${item.size}`;

  const productData = JSON.stringify(item);

  const pipeline = redisClient.multi();

  pipeline.hSet(cartKeyInfo, productKey, productData);

  pipeline.hIncrBy(cartKeyQty, productKey, quantity);

  pipeline.expire(cartKeyInfo, TTL);
  pipeline.expire(cartKeyQty, TTL);

  await pipeline.exec();
};

const validateCartItemsWithDB = async (items) => {
  const variantIds = items.map((item) => new mongoose.Types.ObjectId(`${item.variantId}`));
  const dbVariants = await VariantModel.find({
    _id: { $in: variantIds },
  }).lean();

  const dbVariantMap = new Map(dbVariants.map((v) => [v._id.toString(), v]));

  const updatedItems = [];
  let shouldUpdateRedis = false;

  for (const item of items) {
    const dbVariant = dbVariantMap.get(item.variantId.toString());

    if (!dbVariant) {
      console.warn(
        `Variant ${item.variantId} not found in DB. Removing from cart.`
      );
      shouldUpdateRedis = true;
      continue;
    }

    // Tìm attribute cụ thể trong variant gốc
    const dbAttribute = dbVariant.attribute.find(
      (attr) => attr.size === item.size
    );

    if (!dbAttribute) {
      console.warn(
        `Attribute ${item.size} not found in DB. Removing from cart.`
      );
      shouldUpdateRedis = true;
      continue;
    }

    if (
      item.price !== dbAttribute.price ||
      item.discount !== dbAttribute.discount ||
      item.inStock !== dbAttribute.inStock
    ) {
      console.log(
        `Price or stock mismatch detected for ${item.name}. Updating...`
      );
      shouldUpdateRedis = true; // Cần sync lại Redis
      item.price = dbAttribute.price;
      item.discount = dbAttribute.discount;
      item.inStock = dbAttribute.inStock;
    }

    updatedItems.push(item);
  }

  return { updatedItems, shouldUpdateRedis };
};

const loadCart = async (userId, guestCartId) => {
  const isUser = userId ? true : false;
  const cartKey = isUser ? `cart:${userId}` : `cart:${guestCartId}`;
  const qtyKey = `${cartKey}:qty`;
  const infoKey = `${cartKey}:info`;
  const TTL = isUser ? USER_CART_TTL : GUEST_CART_TTL;

  const [quantities, infos] = await Promise.all([
    redisClient.hGetAll(qtyKey),
    redisClient.hGetAll(infoKey),
  ]);

  let cartItems = [];
  let updateRequired = false;

  if (quantities && Object.keys(quantities).length > 0) {
    cartItems = Object.entries(quantities).map(([productKey, qty]) => {
      const productInfo = infos[productKey]
        ? JSON.parse(infos[productKey])
        : {};
      return { ...productInfo, quantity: parseInt(qty, 10) };
    });

    // const validationResult = await validateCartItemsWithDB(cartItems);
    // cartItems = validationResult.updatedItems;
    // updateRequired = validationResult.shouldUpdateRedis;

    if (updateRequired) {
      const pipeline = redisClient.multi();
      pipeline.del(qtyKey);
      pipeline.del(infoKey);

      for (const item of cartItems) {
        const productKey = `product:${item.variantId}:${item.size}`;
        pipeline.hSet(qtyKey, productKey, item.quantity);
        pipeline.hSet(infoKey, productKey, JSON.stringify(item));
      }
      pipeline.expire(qtyKey, TTL);
      pipeline.expire(infoKey, TTL);
      await pipeline.exec();
    } else {
      const pipeline = redisClient.multi();
      pipeline.expire(qtyKey, TTL);
      pipeline.expire(infoKey, TTL);
      await pipeline.exec();
    }
  } else if (isUser) {
    const mongoCart = await CartModel.findOne({ userId }).lean();

    if (mongoCart) {
      cartItems = mongoCart.items.map((item) => item);

      const validationResult = await validateCartItemsWithDB(cartItems);
      cartItems = validationResult.updatedItems;

      const pipeline = redisClient.multi();
      for (const item of cartItems) {
        const productKey = `product:${item.variantId}:${item.size}`;
        pipeline.hSet(qtyKey, productKey, item.quantity);
        pipeline.hSet(infoKey, productKey, JSON.stringify(item));
      }

      pipeline.expire(qtyKey, TTL);
      pipeline.expire(infoKey, TTL);
      await pipeline.exec();
    }
  }

  return {
    items: cartItems,
    userId: isUser ? userId : undefined,
    guestCartId: !isUser ? guestCartId : undefined,
  };
};

const mergeCart = async (userId, guestCartId) => {
  if (!userId || !guestCartId) {
    return;
  }

  const userCartKey = `cart:${userId}`;
  const guestCartKey = `cart:${guestCartId}`;

  const userCartInfoKey = `${userCartKey}:info`;
  const userCartQtyKey = `${userCartKey}:qty`;
  const guestCartInfoKey = `${guestCartKey}:info`;
  const guestCartQtyKey = `${guestCartKey}:qty`;

  const guestCartExists = await redisClient.exists(guestCartInfoKey);
  if (!guestCartExists) {
    await redisClient.del(guestCartKey, guestCartInfoKey, guestCartQtyKey);
    return;
  }

  const guestCartItems = await redisClient.hGetAll(guestCartInfoKey);
  const guestCartQuantities = await redisClient.hGetAll(guestCartQtyKey);

  if (Object.keys(guestCartItems).length === 0) {
    await redisClient.del(guestCartKey, guestCartInfoKey, guestCartQtyKey);
    return;
  }

  const pipeline = redisClient.multi();
  for (const productKey in guestCartItems) {
    const itemData = guestCartItems[productKey];
    const quantity = parseInt(guestCartQuantities[productKey], 10);

    pipeline.hSet(userCartInfoKey, productKey, itemData);
    pipeline.hIncrBy(userCartQtyKey, productKey, quantity);
  }

  pipeline.expire(userCartInfoKey, USER_CART_TTL);
  pipeline.expire(userCartQtyKey, USER_CART_TTL);
  await redisClient.del(guestCartInfoKey);
  await redisClient.del(guestCartQtyKey);

  await pipeline.exec();
};

const removeCartItem = async (userId, guestCartId, variantId, size) => {
  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyInfo = `${cartKey}:info`;
  const cartKeyQty = `${cartKey}:qty`;
  const productId = `${variantId}:${size}`;
  const productField = `product:${productId}`;

  const pipeline = redisClient.multi();

  pipeline.hDel(cartKeyInfo, productField);
  pipeline.hDel(cartKeyQty, productField);

  await pipeline.exec();

  const remainingItems = await redisClient.hLen(cartKeyQty);
  if (remainingItems === 0) {
    // Sử dụng UNLINK để xóa không đồng bộ, tránh block Redis server
    await redisClient.unlink(cartKeyInfo);
    await redisClient.unlink(cartKeyQty);
  }
};

const updateCartItem = async (
  userId,
  guestCartId,
  variantId,
  size,
  quantity
) => {
  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyQty = `${cartKey}:qty`;
  const productId = `${variantId}:${size}`;
  const productField = `product:${productId}`;
  await redisClient.hSet(cartKeyQty, productField, quantity);
};

export { addCartItem, loadCart, mergeCart, removeCartItem, updateCartItem };
