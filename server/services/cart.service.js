import redisClient from "../config/init.redis.js";
// import { formatCartItemInfo } from "../helpers/cart.helper.js";
import CartModel from "../models/cart.model.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 4; // 4 ngày

const addCartItem = async (userId, guestCartId, item, quantity) => {
  if (quantity === 0) return;

  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const cartKeyInfo = `${cartKey}:info`;
  const cartKeyQty = `${cartKey}:qty`;

  const TTL = userId ? USER_CART_TTL : GUEST_CART_TTL;

  const productKey = `product:${item._id}:${item.size}`;

  const productData = JSON.stringify(item);

  const pipeline = redisClient.multi();

  pipeline.hSet(cartKeyInfo, productKey, productData);

  pipeline.hIncrBy(cartKeyQty, productKey, quantity);

  pipeline.expire(cartKeyInfo, TTL);
  pipeline.expire(cartKeyQty, TTL);

  await pipeline.exec();
};

const loadCart = async (userId, guestCartId) => {
  const isUser = userId ? true : false;
  // Key chính (parent key)
  const cartKey = isUser ? `cart:${userId}` : `cart:${guestCartId}`;
  const qtyKey = `${cartKey}:qty`;
  const infoKey = `${cartKey}:info`;
  const TTL = isUser ? USER_CART_TTL : GUEST_CART_TTL;

  // Lấy dữ liệu từ Redis song song
  const [quantities, infos] = await Promise.all([
    redisClient.hGetAll(qtyKey),
    redisClient.hGetAll(infoKey),
  ]);

  let cartItems = [];

  // --- LOGIC 1: Dữ liệu có sẵn trong Redis (Read-Through Cache Hit) ---
  if (quantities && Object.keys(quantities).length > 0) {
    cartItems = Object.entries(quantities).map(([productKey, qty]) => {
      const productInfo = infos[productKey]
        ? JSON.parse(infos[productKey])
        : {};

      return {
        ...productInfo,
        quantity: parseInt(qty, 10),
      };
    });

    // Sử dụng Pipeline để cập nhật TTL cho cả 2 keys cùng lúc
    const pipeline = redisClient.multi();
    pipeline.expire(qtyKey, TTL);
    pipeline.expire(infoKey, TTL);
    await pipeline.exec();
  }

  // --- LOGIC 2: Dữ liệu không có trong Redis, là User, cần load từ MongoDB (Cache Miss) ---
  else if (isUser) {
    console.log(isUser);
    const mongoCart = await CartModel.findOne({ userId }).lean();

    if (mongoCart) {
      cartItems = mongoCart.items.map((item) => item);
      // đồng bộ lại redis
      const pipeline = redisClient.multi();
      for (const item of mongoCart.items) {
        const productKey = `product:${item.modelId}:${item.size}`;
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

export { addCartItem, loadCart, mergeCart, removeCartItem };
