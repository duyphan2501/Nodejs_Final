import redisClient from "../config/init.redis.js";
// import { formatCartItemInfo } from "../helpers/cart.helper.js";
import CartModel from "../models/cart.model.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 4; // 4 ngày

const addCartItem = async (userId, guestCartId, item, quantity) => {
  if (quantity === 0) return;

  const cartKey = userId ? `cart:${userId}` : `cart:${guestCartId}`;
  const TTL = userId ? USER_CART_TTL : GUEST_CART_TTL;

  const productKey = `product:${item._id}:${item.size}`;

  const productData = JSON.stringify(item);

  const pipeline = redisClient.multi();

  pipeline.hSet(`${cartKey}:info`, productKey, productData);

  pipeline.hIncrBy(`${cartKey}:qty`, productKey, quantity);

  pipeline.expire(cartKey, TTL);

  await pipeline.exec();
};


// Đảm bảo các constants như USER_CART_TTL, GUEST_CART_TTL đã được định nghĩa
// redisClient và CartModel đã được import

const loadCart = async (userId, guestCartId) => {
  const isUser = userId ? true: false;
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
    console.log(isUser)
    const mongoCart = await CartModel.findOne({ userId }).lean();

    if (mongoCart) {
      cartItems = mongoCart.items.map(item => item)
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
      guestCartId: !isUser ? guestCartId : undefined
  };
};

export { addCartItem, loadCart };
