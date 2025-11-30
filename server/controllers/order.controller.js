import createHttpError from "http-errors";
import {
  cancelOrder,
  createNewOrder,
  deleteManyOrder,
  getAllOrder,
  getDailyOrderAmounts,
  getMonthlyOrderAmounts,
  getRevenueAndProfit,
  publishSendOrderEmail,
} from "../services/order.service.js";
import { removeCartItem } from "../services/cart.service.js";
import dotenv from "dotenv";
import { payOS } from "../config/payos.init.js";
import OrderService from "../services/order.service.js";
import OrderModel from "../models/order.model.js";
import { updateUserPoint } from "../services/user.service.js";
import { deductStockAtomic } from "../services/variant.service.js";

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

    const isCOD = provider === "cod";
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
      isCOD ? "pending": "draft"
    );
    let paymentLinkRes;
    if (provider === "payos") {
      const payload = {
        orderCode: newOrder.orderCode,
        amount: newOrder.orderAmount,
        description: newOrder.orderId,
        items: itemsPayos,
        cancelUrl: `${BACKEND_URL}/api/order/cancel-payment`,
        returnUrl: `${CLIENT_URL}/order-success`,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
      };
      paymentLinkRes = await payOS.createPaymentLink(payload);
    }

    if (isCOD) {
      await publishSendOrderEmail(newOrder);
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
    const webhookData = req.body;

    // Bypass giao dịch thử nghiệm
    if (
      ["Ma giao dich thu nghiem", "VQRIO123"].includes(
        webhookData?.data?.description
      )
    ) {
      return res.status(200).json({ success: true, data: webhookData });
    }

    // Xác minh chữ ký
    const verifiedData = payOS.verifyPaymentWebhookData(webhookData);
    console.log("Webhook nhận thành công:", verifiedData);

    const { orderCode, code, desc } = verifiedData;

    // Tìm đơn
    const order = await OrderModel.findOne({ orderCode });
    if (!order) throw createHttpError.NotFound("Đơn hàng không tồn tại");

    // Xử lý khi thanh toán thành công
    const handleSuccess = async () => {
      order.payment.status = "paid";

      // Giảm tồn kho
      await Promise.all(order.items.map((item) => deductStockAtomic(item)));

      // Sử dụng mã giảm giá
      if (order.coupon?.code) {
        await useCouponAtomic(order.coupon.code, order._id);
      }

      // Trừ điểm
      if (order.usedPoint?.point > 0 && order.userId) {
        await usePurchasePoint(order.userId, order.usedPoint.point);
      }

      // Gửi email
      await publishSendOrderEmail(order);
    };

    // Xử lý khi thất bại
    const handleFailed = () => {
      order.payment.status = "failed";
      order.description = desc || "";
    };

    // Quyết định theo mã trả về của PayOS
    if (code === "00") {
      await handleSuccess();
    } else {
      handleFailed();
    }

    await order.save();

    // Trả về PayOS bắt buộc 200 OK
    return res.status(200).json({
      success: true,
      data: verifiedData,
    });
  } catch (error) {
    next(error);
  }
};

const canclePayment = async (req, res, next) => {
  try {
    const { orderCode } = req.query;
    if (!orderCode) {
      throw createHttpError.BadRequest("Thiếu orderCode truy vấn");
    }
    const order = await OrderModel.findOne({ orderCode });
    if (!order) {
      throw createHttpError.NotFound("Không tồn tại đơn hàng này");
    }

    order.status = "cancelled";
    order.payment.status = "cancelled";
    order.description = "Khách hàng hủy thanh toán PayOS";
    await order.save();

    return res.redirect(`${CLIENT_URL}/checkout`);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const result = await getAllOrder();
    console.log(result)

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

    let result = "";

    if (status !== "cancelled") {
      result = await OrderModel.updateOne(
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
    } else {
      await cancelOrder(order[0]);
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

const getOrderByOrderCode = async (req, res, next) => {
  try {
    const orderCode = req.params.orderCode;
    if (!orderCode) {
      throw createHttpError.BadRequest("Thiếu orderCode truy vấn");
    }
    const result = await OrderModel.findOne({ orderCode });
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

// GET /api/orders/:orderId - Lấy chi tiết đơn hàng
const getOrderTrackingById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
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
};

export {
  createOrder,
  verifyWebhookData,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getDashboardData,
  getOrderByOrderCode,
  canclePayment,
  getOrderTrackingById,
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

      const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
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
