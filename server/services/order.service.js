import OrderModel from "../models/order.model.js";

async function generateOrderId() {
  let orderId;
  let isUnique = false;

  const now = new Date();
  const YY = now.getFullYear().toString().slice(-2);
  const MM = (now.getMonth() + 1).toString().padStart(2, "0");
  const DD = now.getDate().toString().padStart(2, "0");
  const dateSegment = `${YY}${MM}${DD}`;

  while (!isUnique) {
    const randomChars = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    orderId = `ORD-${dateSegment}-${randomChars}`;
    const existingOrder = await OrderModel.findOne({ orderId });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return orderId;
}

const createNewOrder = async (
  cartItems,
  email,
  address,
  provider,
  coupon,
  usedPoint,
  subTotal,
  itemsDiscounted,
  orderStatus = "pending"
) => {
  const items = [];
  const itemsPayos = [];

  for (const item of cartItems) {
    const name = `${item.name}-${item.color}`

    const discountPrice =
      Math.round((item.price * (1 - item.discount / 100)) / 1000) * 1000;

    // await reserveStock(userId, null, item.modelId, item.quantity);

    items.push({ ...item, inStock: undefined });
    itemsPayos.push({ name, quantity: item.quantity, price: discountPrice });
  }

  const orderId = await generateOrderId();
  const orderCode = Number(
    `${Date.now()}`.slice(-7) + Math.floor(Math.random() * 90 + 10)
  ); // ra 9 chữ số ngẫu nhiên từ timestamp

  // Tạo đơn trong DB
  const newOrder = await OrderModel.create({
    orderCode,
    orderId,
    email,
    items,
    subTotal,
    itemsDiscounted,
    shippingInfo: {
      receiver: address.receiver,
      phone: address.phone,
      ward: address.ward,
      province: address.province,
      addressDetail: address.addressDetail,
    },
    payment: {
      provider: provider,
      status: orderStatus,
    },
    status: orderStatus,
    coupon,
    usedPoint,
  });

  if (!newOrder) throw new Error("Failed to create new order");

  return {
    newOrder,
    itemsPayos,
  };
};

export { generateOrderId, createNewOrder };
