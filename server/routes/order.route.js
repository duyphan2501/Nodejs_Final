import express from "express";
import {
  createOrder,
  verifyWebhookData,
} from "../controllers/order.controller.js";
import OrderController from "../controllers/order.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.post("/webhook/payos", verifyWebhookData);

orderRouter.use(checkAuth);

// GET /api/orders - Lấy tất cả đơn hàng
orderRouter.get("/", OrderController.getAllOrders);

// GET /api/orders/active - Lấy đơn hàng đang xử lý
orderRouter.get("/active", OrderController.getActiveOrders);

// GET /api/orders/stats - Lấy thống kê đơn hàng
orderRouter.get("/stats", OrderController.getOrderStats);

// GET /api/orders/status/:status - Lọc đơn hàng theo trạng thái
orderRouter.get("/status/:status", OrderController.getOrdersByStatus);

// GET /api/orders/:orderId - Lấy chi tiết đơn hàng
orderRouter.get("/:orderId", OrderController.getOrderById);

// POST /api/orders/fake-delivery/:orderId - FAKE API test chuyển trạng thái
orderRouter.post("/fake-delivery/:orderId", OrderController.fakeDeliveryUpdate);

export default orderRouter;
