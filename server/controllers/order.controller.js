import createHttpError from "http-errors";
import {
  createNewOrder,
  deleteManyOrder,
  getAllOrder,
  getDailyOrderAmounts,
  getMonthlyOrderAmounts,
  getRevenueAndProfit,
} from "../services/order.service.js";
import { removeCartItem } from "../services/cart.service.js";
import dotenv from "dotenv";
import { payOS } from "../config/payos.init.js";
import OrderService from "../services/order.service.js";
import OrderModel from "../models/order.model.js";
import { updateUserPoint } from "../services/user.service.js";

dotenv.config({ quiet: true });
const BACKEND_URL = process.env.BACKEND_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const createOrder = async (req, res, next) => {
  try {
    const {
      cartItems,
      email,
      address,
      provider,
      coupon,
      usedPoint,
      orderAmount,
      itemsDiscounted,
      userId,
    } = req.body;

    // 1. Xác thực dữ liệu đầu vào chi tiết hơn
    if (!email) {
      throw createHttpError.BadRequest("Thiếu email người nhận.");
    }
    if (!cartItems || cartItems.length === 0) {
      throw createHttpError.BadRequest("Giỏ hàng rỗng.");
    }
    if (!address || !address.phone || !address.province) {
      throw createHttpError.BadRequest("Thiếu thông tin địa chỉ giao hàng.");
    }
    if (!provider) {
      throw createHttpError.BadRequest("Thiếu phương thức thanh toán.");
    }
    if (orderAmount === undefined || itemsDiscounted === undefined) {
      throw createHttpError.BadRequest("Thiếu thông tin tổng tiền.");
    }

    // 2. Gọi hàm logic tạo đơn hàng cốt lõi
    const { newOrder, itemsPayos } = await createNewOrder(
      cartItems,
      email,
      address,
      provider,
      coupon,
      usedPoint,
      orderAmount,
      itemsDiscounted,
      userId,
      "pending"
    );
    let paymentLinkRes;
    if (provider === "payos") {
      const payload = {
        orderCode: newOrder.orderCode,
        amount: newOrder.orderAmount,
        description: newOrder.orderId,
        items: itemsPayos,
        cancelUrl: `${BACKEND_URL}/api/order/cancel-payment`,
        returnUrl: `${CLIENT_URL}/payment/success`,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
      };
      paymentLinkRes = await payOS.createPaymentLink(payload);
    }

    res.status(201).json({
      success: true,
      message: "Đơn hàng đã được tạo thành công.",
      order: newOrder,
      url: paymentLinkRes ? paymentLinkRes.checkoutUrl : null,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error.message);
    // Chuyển lỗi xuống middleware xử lý lỗi tập trung
    next(error);
  }
};

const verifyWebhookData = async (req, res, next) => {
  try {
    // Dữ liệu từ PayOS gửi về
    const webhookData = req.body;

    // Xác minh chữ ký
    const verifiedData = payOS.verifyPaymentWebhookData(webhookData);
    if (
      ["Ma giao dich thu nghiem", "VQRIO123"].includes(
        webhookData.data.description
      )
    ) {
      return res.status(200).json({
        success: true,
        data: webhookData,
      });
    }
    // Nếu xác minh thành công
    console.log("Webhook nhận thành công:", verifiedData);

    const order = await orderModel.findOne({
      orderCode: verifiedData.orderCode,
    });

    if (!order) throw createHttpError.NotFound("Đơn hàng không tồn tại");

    if (verifiedData.code === "00") {
      order.status = "processing";
      order.payment.status = "paid";
      // xoá giỏ hàng
      const userId = order.userId;
      for (const item of order.items) {
        await removeCartItem(userId, null, item.variantId, item.size);
        // await cancelStockReservation(userId, item.modelId, true);
      }
      //   await CartModel.deleteOne({ userId });
    } else {
      // Thanh toán thất bại
      order.payment.status = "failed";
      order.description = verifiedData.desc;
      await order.save();
    }
    await order.save();

    // Phản hồi cho PayOS
    res.status(200).json({ data: verifiedData, success: true });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const result = await getAllOrder();

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const status = req.body.status;

    if (!_id || !status) {
      throw createHttpError.BadRequest("Thiếu thông tin");
    }

    const order = await OrderModel.find({ _id });

    if (!order) {
      throw createHttpError.NotFound("Không tìm thấy đơn hàng");
    }

    const result = await OrderModel.updateOne(
      { _id: req.params._id },
      {
        $set: { status: req.body.status },
        $push: {
          statusHistory: {
            status: req.body.status,
            updatedAt: new Date(),
          },
        },
      }
    );

    if (status === "delivered" && result.modifiedCount !== 0) {
      const amount = order[0].orderAmount || 0;
      const pointToAdd = Math.floor((amount * 10) / 100 / 1000);

      await updateUserPoint(order[0].email, pointToAdd);
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const _ids = req.body._ids;

    if (!_ids) {
      throw createHttpError.BadRequest("Không tồn tại id này");
    }

    const result = await deleteManyOrder(_ids);

    return res.status(200).json({
      success: true,
      message: `Đã xóa thành công ${result.deletedCount} đơn hàng!`,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const _id = req.params._id;

    if (!_id) {
      throw createHttpError.BadRequest("Thiếu _id truy vấn");
    }

    const result = await OrderModel.findById(_id);

    if (!result) {
      throw createHttpError.NotFound("Không tồn tại đơn hàng này");
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardData = async (req, res, next) => {
  try {
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate;

    if (!startDate || !endDate) {
      throw createHttpError.BadRequest("Thiếu dữ liệu thời gian");
    }

    let growthDataMonth = {};
    let growthDataDaily = {};
    let revenueChartData = [];

    const monthlyRevenueData = await getMonthlyOrderAmounts();
    const dailyRevenueData = await getDailyOrderAmounts();
    const resRevenue = await getRevenueAndProfit(startDate, endDate);

    if (monthlyRevenueData.length < 2) {
      growthDataMonth.message = "Chưa có dữ liệu 2 tháng gần nhất";
      growthDataMonth.rate = 0;
      growthDataMonth.variance = 0;
    } else {
      const lastMonth = monthlyRevenueData[0].totalAmount;
      const thisMonth = monthlyRevenueData[1].totalAmount;

      growthDataMonth.rate = Number(
        (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(2)
      );
      growthDataMonth.variance = growthDataMonth.rate - 100;
    }

    let yesterday = 0;
    let today = 0;

    if (dailyRevenueData.length === 0) {
      growthDataDaily.today = 0;
      growthDataDaily.variance = 0;
    } else if (dailyRevenueData.length < 2) {
      const now = new Date();
      const todayStr = now.toLocaleDateString("sv-SE");
      if (dailyRevenueData[0]._id === todayStr) {
        yesterday = 0;
        today = dailyRevenueData[0].totalAmount;
      } else {
        yesterday = dailyRevenueData[0].totalAmount;
        today = 0;
      }

      growthDataDaily.today = Number(today);
      growthDataDaily.variance = Number(
        (((today - yesterday) / yesterday) * 100).toFixed(2)
      );
    } else {
      const yesterday = dailyRevenueData[0].totalAmount;
      const today = dailyRevenueData[1].totalAmount;

      growthDataDaily.today = Number(today);
      growthDataDaily.variance = Number(
        (((today - yesterday) / yesterday) * 100).toFixed(2)
      );
    }

    revenueChartData = resRevenue;

    return res.status(200).json({
      success: true,
      growthDataMonth,
      growthDataDaily,
      revenueChartData,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createOrder,
  verifyWebhookData,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getDashboardData,
};

class OrderController {
  // GET /api/orders - Lấy tất cả đơn hàng của user
  async getAllOrders(req, res) {
    try {
      const userId = req.user.userId; // ✅ FIX: Lấy userId từ JWT token
      const orders = await OrderService.getUserOrders(userId);
      const formattedOrders = orders.map((order) =>
        OrderService.formatOrderForFrontend(order)
      );
      res.status(200).json({
        success: true,
        data: formattedOrders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/active - Lấy đơn hàng đang xử lý
  async getActiveOrders(req, res) {
    try {
      const userId = req.user.userId; // ✅ FIX: Lấy userId từ JWT token
      const orders = await OrderService.getActiveOrders(userId);
      const formattedOrders = orders.map((order) =>
        OrderService.formatOrderForFrontend(order)
      );
      res.status(200).json({
        success: true,
        data: formattedOrders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/:orderId - Lấy chi tiết đơn hàng
  async getOrderById(req, res) {
    try {
      const userId = req.user.userId; // ✅ FIX: Lấy userId từ JWT token
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId, userId);
      const formattedOrder = OrderService.formatOrderForFrontend(order);
      res.status(200).json({
        success: true,
        data: formattedOrder,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
  async cancelOrder(req, res) {
    try {
      const userId = req.user.userId; // Lấy userId từ JWT
      const { orderId } = req.params;

      const cancelledOrder = await OrderService.cancelOrder(orderId, userId);
      const formattedOrder =
        OrderService.formatOrderForFrontend(cancelledOrder);

      res.status(200).json({
        success: true,
        message: "Đơn hàng đã được hủy thành công",
        data: formattedOrder,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  // GET /api/orders/status/:status - Lọc đơn hàng theo trạng thái
  async getOrdersByStatus(req, res) {
    try {
      const userId = req.user.userId; // ✅ FIX: Lấy userId từ JWT token
      const { status } = req.params;

      const validStatuses = ["pending", "confirmed", "shipping", "delivered"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const orders = await OrderService.getOrdersByStatus(userId, status);
      const formattedOrders = orders.map((order) =>
        OrderService.formatOrderForFrontend(order)
      );
      res.status(200).json({
        success: true,
        data: formattedOrders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/orders/stats - Lấy thống kê đơn hàng
  async getOrderStats(req, res) {
    try {
      const userId = req.user.userId; // ✅ FIX: Lấy userId từ JWT token
      const stats = await OrderService.getOrderStats(userId);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/orders/fake-delivery/:orderId - FAKE API để test chuyển trạng thái
  async fakeDeliveryUpdate(req, res) {
    try {
      const { orderId } = req.params;
      const updatedOrder = await OrderService.updateOrderStatus(orderId);
      const formattedOrder = OrderService.formatOrderForFrontend(updatedOrder);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${updatedOrder.status}`,
        data: formattedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new OrderController();
