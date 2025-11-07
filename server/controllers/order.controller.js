import createHttpError from "http-errors";
import { createNewOrder } from "../services/order.service.js";
import { removeCartItem } from "../services/cart.service.js";
import dotenv from "dotenv";
import { payOS } from "../config/payos.init.js";
import OrderService from "../services/order.service.js";

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

export { createOrder, verifyWebhookData };

class OrderController {
  // GET /api/orders - Lấy tất cả đơn hàng của user
  async getAllOrders(req, res) {
    try {
      const email = req.user.email; // Lấy từ JWT token
      const orders = await OrderService.getUserOrders(email);
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
      const email = req.user.email;
      const orders = await OrderService.getActiveOrders(email);
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
      const email = req.user.email;
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId, email);
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

  // GET /api/orders/status/:status - Lọc đơn hàng theo trạng thái
  async getOrdersByStatus(req, res) {
    try {
      const email = req.user.email;
      const { status } = req.params;

      const validStatuses = ["pending", "confirmed", "shipping", "delivered"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const orders = await OrderService.getOrdersByStatus(email, status);
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
      const email = req.user.email;
      const stats = await OrderService.getOrderStats(email);
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
