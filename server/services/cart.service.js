import mongoose from "mongoose";
import redisClient from "../config/init.redis.js";
// import { formatCartItemInfo } from "../helpers/cart.helper.js";
import CartModel from "../models/cart.model.js";
import VariantModel from "../models/variant.model.js";
import { getAvailableStockDB } from "./variant.service.js";
import createHttpError from "http-errors";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 4; // 4 ngày

const addCartItem = async (userId, guestCartId, item, quantity) => {
  if (quantity === 0) return;

  const availableStockDB = await getAvailableStockDB(item.variantId, item.size);

  if (availableStockDB === 0)
    throw createHttpError.BadRequest("Sản phẩm đã hết hàng");

  const productKey = `product:${item.variantId}:${item.size}`;
  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyInfo = `${cartKey}:info`;
  const cartKeyQty = `${cartKey}:qty`;

  const currentQtyStr = await redisClient.hGet(`${cartKey}:qty`, productKey);
  const currentQtyInCart = parseInt(currentQtyStr || "0", 10);

  const newTotalQuantity = currentQtyInCart + quantity;

  if (newTotalQuantity > availableStockDB) {
    const remainingToAdd = availableStockDB - currentQtyInCart;
    if (remainingToAdd === 0) {
      throw createHttpError.BadRequest("Sản phẩm đã hết hàng");
    }
    throw createHttpError.BadRequest(
      `Bạn chỉ có thể thêm tối đa ${remainingToAdd} sản phẩm nữa.`
    );
  }

  const TTL = userId ? USER_CART_TTL : GUEST_CART_TTL;

  const productData = JSON.stringify(item);

  const pipeline = redisClient.multi();

  pipeline.hSet(cartKeyInfo, productKey, productData);

  pipeline.hIncrBy(cartKeyQty, productKey, quantity);

  pipeline.expire(cartKeyInfo, TTL);
  pipeline.expire(cartKeyQty, TTL);

  await pipeline.exec();
};

const validateCartItemsWithDB = async (items) => {
  if (!items || items.length === 0) {
    return { updatedItems: [], shouldUpdateRedis: false };
  }

  // Lấy danh sách variantId
  const variantIds = items.map(
    (item) => new mongoose.Types.ObjectId(item.variantId)
  );

  // Lấy toàn bộ variants trong DB
  const dbVariants = await VariantModel.find({
    _id: { $in: variantIds },
  }).lean();

  // Map để lookup nhanh
  const dbVariantMap = new Map(dbVariants.map((v) => [v._id.toString(), v]));

  let shouldUpdateRedis = false;
  const updatedItems = [];

  for (const item of items) {
    const dbVariant = dbVariantMap.get(item.variantId.toString());

    if (!dbVariant) {
      console.warn(`Variant ${item.variantId} not found. Removing from cart.`);
      shouldUpdateRedis = true;
      continue;
    }

    // Tìm attribute theo size
    const dbAttr = dbVariant.attributes.find((attr) => attr.size === item.size);

    if (!dbAttr) {
      console.warn(
        `Size '${item.size}' not found for variant ${item.variantId}. Removing.`
      );
      shouldUpdateRedis = true;
      continue;
    }

    // Lấy giá mới từ DB
    const correctPrice = dbVariant.price;
    const correctDiscount = dbVariant.discount;
    const correctStock = dbAttr.inStock;

    // Nếu có thay đổi → cập nhật
    if (
      item.price !== correctPrice ||
      item.discount !== correctDiscount ||
      item.inStock !== correctStock
    ) {
      console.log(
        `Syncing price/stock for ${item.name} (${item.variantId}, size ${item.size})`
      );

      shouldUpdateRedis = true;
      item.price = correctPrice;
      item.discount = correctDiscount;
      item.inStock = correctStock;
    }

    updatedItems.push(item);
  }

  return { updatedItems, shouldUpdateRedis };
};

const saveCartToRedis = async (cartItems, qtyKey, infoKey, TTL) => {
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
};

const loadCart = async (userId, guestCartId) => {
  const isUser = !!userId;
  const cartKey = isUser ? `cart:${userId}` : `cart:${guestCartId}`;
  const qtyKey = `${cartKey}:qty`;
  const infoKey = `${cartKey}:info`;
  const TTL = isUser ? USER_CART_TTL : GUEST_CART_TTL;

  // Load Redis
  const [quantities, infos] = await Promise.all([
    redisClient.hGetAll(qtyKey),
    redisClient.hGetAll(infoKey),
  ]);

  let cartItems = [];
  let mustRewriteRedis = false;

  if (quantities && Object.keys(quantities).length > 0) {
    for (const [productKey, qty] of Object.entries(quantities)) {
      let productInfo = {};

      try {
        productInfo = infos[productKey] ? JSON.parse(infos[productKey]) : null;

        if (!productInfo) {
          console.warn(`Missing product info in Redis: ${productKey}`);
          mustRewriteRedis = true;
          continue;
        }
      } catch {
        console.warn(`Corrupted JSON in Redis key: ${productKey}`);
        mustRewriteRedis = true;
        continue;
      }

      cartItems.push({
        ...productInfo,
        quantity: Number(qty),
      });
    }

    // Validate items with DB
    const result = await validateCartItemsWithDB(cartItems);
    cartItems = result.updatedItems;

    if (result.shouldUpdateRedis || mustRewriteRedis) {
      await saveCartToRedis(cartItems, qtyKey, infoKey, TTL);
    } else {
      // Renew TTL
      await redisClient.multi().expire(qtyKey, TTL).expire(infoKey, TTL).exec();
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
  newQuantity
) => {
  const availableStockDB = await getAvailableStockDB(variantId, size);

  if (availableStockDB === 0)
    throw createHttpError.BadRequest("Sản phẩm đã hết hàng");

  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyQty = `${cartKey}:qty`;
  const productKey = `product:${variantId}:${size}`;

  if (newQuantity > availableStockDB) {
    throw createHttpError.BadRequest("Không đủ số lượng để thêm vào giỏ hàng");
  }

  await redisClient.hSet(cartKeyQty, productKey, newQuantity);
};

export { addCartItem, loadCart, mergeCart, removeCartItem, updateCartItem };
