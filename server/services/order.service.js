import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import { rollbackCoupon, useCouponAtomic } from "./coupon.service.js";
import { rollbackPurchasePoint, usePurchasePoint } from "./user.service.js";
import { addStockAtomic, deductStockAtomic } from "./variant.service.js";
import client from "../config/init.redis.js";
const REDIS_CHANNEL = "order_events";

const getOrdersSummary = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const result = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: "delivered",
      },
    },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "variants",
        localField: "items.variantId",
        foreignField: "_id",
        as: "variantData",
      },
    },
    { $unwind: "$variantData" },

    {
      $lookup: {
        from: "products",
        localField: "variantData._id",
        foreignField: "variants",
        as: "productData",
      },
    },
    { $unwind: "$productData" },

    {
      $group: {
        _id: { orderId: "$orderId", productId: "$productData._id" },
        orderCreatedAt: { $first: "$createdAt" },
        product_name: { $first: "$productData.name" },
        image: { $first: { $arrayElemAt: ["$variantData.images", 0] } },
        quantity: { $sum: "$items.quantity" },
      },
    },

    {
      $group: {
        _id: "$_id.orderId",
        date_created: {
          $first: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" },
          },
        },
        items: {
          $push: {
            product_id: "$_id.productId",
            product_name: "$product_name",
            quantity: "$quantity",
            image: "$image",
          },
        },
      },
    },

    // Project đổi tên fields
    {
      $project: {
        _id: 0,
        order_id: "$_id",
        date_created: 1,
        items: 1,
      },
    },

    { $sort: { date_created: 1 } },
  ]);

  return result;
};

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

const publishSendOrderEmail = async (order) => {
  const messagePayload = JSON.stringify(order);
  const subscriberCount = await client.publish(REDIS_CHANNEL, messagePayload);
  console.log(
    `Đã publish sự kiện đơn hàng lên Redis. ${subscriberCount} người nghe nhận được.`
  );
};

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
  let newOrderResult;

  try {
    session.startTransaction();

    const items = [];
    const itemsPayos = [];
    const isCOD = provider === "cod";

    // --- 1. Kiểm tra tồn kho & Chuẩn bị dữ liệu ---
    for (const item of cartItems) {
      if (isCOD) await deductStockAtomic(item, session);

      const discountPrice =
        Math.round((item.price * (1 - item.discount / 100)) / 1000) * 1000;

      const processedItem = {
        orderItem: { ...item, inStock: undefined },
        payosItem: {
          name: `${item.name}-${item.color}`,
          quantity: item.quantity,
          price: discountPrice,
        },
      };
      items.push(processedItem.orderItem);
      itemsPayos.push(processedItem.payosItem);
    }

    const orderId = await generateOrderId();
    const orderCode = Number(
      `${Date.now()}`.slice(-7) + Math.floor(Math.random() * 90 + 10)
    );

    // --- 3. Xử lý Coupon & User Points ---
    if (isCOD) {
      if (coupon.code !== "") {
        await useCouponAtomic(coupon.code, orderId, session);
      }

      if (usedPoint.point > 0 && userId) {
        await usePurchasePoint(userId, usedPoint.point, session);
      }
    }

    // --- 4. Tạo đơn hàng trong DB ---
    const newOrders = await OrderModel.create(
      [
        {
          orderCode,
          orderId,
          email,
          userId,
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
            status: "pending",
          },
          status: orderStatus,
          statusHistory: [
            {
              status: orderStatus,
              updatedAt: Date.now(),
            },
          ],
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

const cancelOrder = async (order) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await OrderModel.updateOne(
      { _id: order._id },
      {
        $set: { status: "cancelled" },
        $push: {
          statusHistory: {
            status: "cancelled",
            updatedAt: new Date(),
          },
        },
      },
      {
        session,
      }
    );

    for (const item of order.items) {
      await addStockAtomic(item, session);
    }

    if (order?.coupon?.code !== "") {
      await rollbackCoupon(order.coupon.code, order._id, session);
    }

    if (order?.usedPoint?.point && order?.usedPoint?.point !== 0) {
      await rollbackPurchasePoint(order.email, order.usedPoint.point, session);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrder = async () => {
  const result = await OrderModel.find({}).sort({ createdAt: -1 });
  return result;
};

const deleteManyOrder = async (_ids) => {
  try {
    const objectIds = _ids.map((id) => ({
      _id: new mongoose.Types.ObjectId(id),
    }));
    const result = OrderModel.deleteMany({ _id: { $in: objectIds } });

    return result;
  } catch (error) {
    throw error;
  }
};

async function getMonthlyOrderAmounts() {
  const now = new Date();

  // Tháng này
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Tháng trước
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfThisMonthForLast = startOfThisMonth; // đã tính ở trên

  const results = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfLastMonth, $lt: startOfNextMonth },
      },
    },

    {
      $project: {
        orderAmount: 1,
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    },

    {
      $group: {
        _id: { year: "$year", month: "$month" },
        totalAmount: { $sum: "$orderAmount" },
      },
    },

    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return results;
}

async function getDailyOrderAmounts() {
  const now = new Date();

  // Hôm nay: từ 00:00 đến 23:59:59
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  // Hôm qua: từ 00:00 đến 23:59:59
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const results = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYesterday, $lt: startOfTomorrow },
      },
    },
    {
      $project: {
        orderAmount: 1,
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
    {
      $group: {
        _id: "$date",
        totalAmount: { $sum: "$orderAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return results;
}

const getRevenueAndProfit = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const result = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: "delivered",
      },
    },
    { $unwind: "$items" }, // mỗi document là 1 item
    {
      $lookup: {
        from: "variants",
        localField: "items.variantId",
        foreignField: "_id",
        as: "variantData",
      },
    },
    { $unwind: "$variantData" },
    {
      $lookup: {
        from: "products",
        localField: "variantData._id",
        foreignField: "variants",
        as: "productData",
      },
    },
    { $unwind: "$productData" },
    {
      $project: {
        date_created: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        orderId: 1,
        revenue: { $multiply: ["$items.price", "$items.quantity"] },
        profit: {
          $multiply: [
            { $subtract: ["$items.price", "$productData.inputPrice"] },
            "$items.quantity",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$date_created",
        revenue: { $sum: "$revenue" },
        profit: { $sum: "$profit" },
        orderCount: { $addToSet: "$orderId" }, // gom orderId duy nhất
      },
    },
    {
      $project: {
        _id: 0,
        date_created: "$_id",
        revenue: 1,
        profit: 1,
        orderCount: { $size: "$orderCount" }, // số đơn hàng trong ngày
      },
    },
    { $sort: { date_created: 1 } },
  ]);

  return result;
};

export {
  generateOrderId,
  createNewOrder,
  getAllOrder,
  deleteManyOrder,
  getMonthlyOrderAmounts,
  getDailyOrderAmounts,
  getRevenueAndProfit,
  getOrdersSummary,
  publishSendOrderEmail,
  cancelOrder,
};

class OrderService {
  // Lấy email từ userId
  async getUserEmail(userId) {
    try {
      const user = await UserModel.findById(userId).select("email");
      if (!user) {
        throw new Error("User not found");
      }
      return user.email;
    } catch (error) {
      throw new Error(`Error fetching user email: ${error.message}`);
    }
  }

  // Lấy tất cả đơn hàng của user
  async getUserOrders(userId) {
    try {
      const email = await this.getUserEmail(userId);
      const orders = await OrderModel.find({ email, status: { $ne: "draft" } })
        .populate("items.variantId")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo ID
  async getOrderById(orderId) {
    try {
      const order = await OrderModel.findOne({ orderId }).populate(
        "items.variantId"
      );
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }
  async cancelOrder(orderId, userId) {
    try {
      const email = await this.getUserEmail(userId);
      const order = await OrderModel.findOne({ orderId, email });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Chỉ cho phép hủy đơn hàng ở trạng thái pending
      if (order.status !== "pending") {
        throw new Error("Chỉ có thể hủy đơn hàng đang chờ xử lý");
      }

      order.status = "cancelled";
      await order.save();

      return order;
    } catch (error) {
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }
  // Lấy đơn hàng theo trạng thái
  async getOrdersByStatus(userId, status) {
    try {
      const email = await this.getUserEmail(userId);
      const orders = await OrderModel.find({ email, status })
        .populate("items.variantId")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders by status: ${error.message}`);
    }
  }

  // Lấy các đơn hàng đang xử lý (pending, confirmed, shipping)
  async getActiveOrders(userId) {
    try {
      const email = await this.getUserEmail(userId);
      const orders = await OrderModel.find({
        email,
        status: { $in: ["pending", "confirmed", "shipping"] },
      })
        .populate("items.variantId")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching active orders: ${error.message}`);
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId, userId) {
    try {
      const email = await this.getUserEmail(userId);
      const order = await OrderModel.findOne({ orderId, email });

      if (!order) {
        throw new Error("Order not found");
      }

      // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
      if (!["pending", "confirmed"].includes(order.status)) {
        throw new Error("Không thể hủy đơn hàng ở trạng thái này");
      }

      order.status = "cancelled";
      await order.save();

      return order;
    } catch (error) {
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  // Cập nhật trạng thái đơn hàng (FAKE API - để test)
  async updateOrderStatus(orderId) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) {
        throw new Error("Order not found");
      }

      // Logic chuyển trạng thái tự động
      let newStatus = order.status;
      switch (order.status) {
        case "pending":
          newStatus = "confirmed";
          break;
        case "confirmed":
          newStatus = "shipping";
          break;
        case "shipping":
          newStatus = "delivered";
          break;
        default:
          newStatus = order.status;
      }

      order.status = newStatus;
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Tính toán thời gian giao hàng dự kiến
  calculateEstimatedDelivery(createdAt) {
    const deliveryDate = new Date(createdAt);
    deliveryDate.setMinutes(deliveryDate.getMinutes() + 5); // 5 phút sau khi tạo
    return deliveryDate;
  }

  // Format đơn hàng cho frontend
  formatOrderForFrontend(order) {
    const statusMap = {
      pending: "Đang chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang vận chuyển",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };

    const estimatedDelivery = this.calculateEstimatedDelivery(order.createdAt);
    const isDelivered = order.status === "delivered";
    const isCancelled = order.status === "cancelled";

    return {
      id: order.orderId,
      orderCode: order.orderCode,
      date: order.createdAt.toISOString().split("T")[0],
      time: order.createdAt.toTimeString().split(" ")[0].substring(0, 5),
      total: order.orderAmount,
      status: order.status,
      currentStatus: statusMap[order.status],
      deliveryDate: isDelivered
        ? order.updatedAt.toISOString().split("T")[0]
        : null,
      cancelledDate: isCancelled
        ? order.updatedAt.toISOString().split("T")[0]
        : null,
      estimatedDelivery:
        !isDelivered && !isCancelled
          ? estimatedDelivery.toISOString().split("T")[0]
          : null,
      products: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
        image: item.image,
      })),
      shippingAddress: {
        name: order.shippingInfo.receiver,
        phone: order.shippingInfo.phone,
        address: `${order.shippingInfo.addressDetail}, ${order.shippingInfo.ward}, ${order.shippingInfo.province}`,
      },
      paymentMethod:
        order.payment.provider === "COD"
          ? "Thanh toán khi nhận hàng (COD)"
          : "Chuyển khoản ngân hàng",
      coupon: order.coupon,
      usedPoint: order.usedPoint,
      itemsDiscounted: order.itemsDiscounted,
      statusHistory: order.statusHistory
        .map((his) => ({
          status: statusMap[his.status],
          updatedAt: his.updatedAt.toTimeString().split(" ")[0].substring(0, 5),
        }))
        .reverse(),
    };
  }

  // Thống kê đơn hàng
  async getOrderStats(userId) {
    try {
      const email = await this.getUserEmail(userId);
      const orders = await OrderModel.find({ email });
      const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        confirmed: orders.filter((o) => o.status === "confirmed").length,
        shipping: orders.filter((o) => o.status === "shipping").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
      };
      return stats;
    } catch (error) {
      throw new Error(`Error fetching order stats: ${error.message}`);
    }
  }
}

export default new OrderService();
