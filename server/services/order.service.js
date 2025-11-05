import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import { useCouponAtomic } from "./coupon.service.js";
import { usePurchasePoint } from "./user.service.js";
import { deductStockAtomic } from "./variant.service.js";

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
  orderAmount,
  itemsDiscounted,
  userId, 
  orderStatus = "pending"
) => {
  const session = await mongoose.startSession();
  let newOrderResult; // Biến để lưu trữ kết quả đơn hàng sau khi tạo

  try {
    session.startTransaction();

    const items = [];
    const itemsPayos = [];

    // --- 1. Kiểm tra tồn kho & Chuẩn bị dữ liệu ---
    for (const item of cartItems) {
      const processedItem = await deductStockAtomic(item, session);
      items.push(processedItem.orderItem);
      itemsPayos.push(processedItem.payosItem);
    }

    const orderId = await generateOrderId();
    const orderCode = Number(
      `${Date.now()}`.slice(-7) + Math.floor(Math.random() * 90 + 10)
    );

    // --- 3. Xử lý Coupon & User Points ---
    if (coupon.code !== "") {
      await useCouponAtomic(coupon.code, orderId, session);
    }

    if (usedPoint.point > 0 && userId) {
      await usePurchasePoint(userId, usedPoint.point, session);
    }

    // --- 4. Tạo đơn hàng trong DB ---
    // Mongoose Model.create([docs], { session }) cần nhận mảng khi dùng với transaction
    const newOrders = await OrderModel.create(
      [
        {
          orderCode,
          orderId,
          email,
          items,
          orderAmount,
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
        },
      ],
      { session }
    );

    if (!newOrders || newOrders.length === 0) {
      throw createHttpError(500, "Failed to create new order in the database.");
    }

    newOrderResult = newOrders[0];

    // --- 5. Commit Transaction ---
    await session.commitTransaction();

    return {
      newOrder: newOrderResult,
      itemsPayos,
    };
  } catch (error) {
    // --- 6. Abort Transaction nếu có lỗi xảy ra ở bất kỳ bước nào ---
    await session.abortTransaction();
    throw error;
  } finally {
    // --- 7. Kết thúc Session ---
    session.endSession();
  }
};

export { generateOrderId, createNewOrder };
