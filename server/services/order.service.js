import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
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
  let newOrderResult;

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

const getAllOrder = async () => {
  try {
    const result = await OrderModel.find({});

    return result;
  } catch (error) {
    throw error;
  }
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

export { generateOrderId, createNewOrder, getAllOrder, deleteManyOrder };

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
      const orders = await OrderModel.find({ email })
        .populate("items.variantId")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo ID
  async getOrderById(orderId, userId) {
    try {
      const email = await this.getUserEmail(userId);
      const order = await OrderModel.findOne({ orderId, email }).populate(
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
