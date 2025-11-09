import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  verifyWebhookData,
} from "../controllers/order.controller.js";
import OrderController from "../controllers/order.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/all", checkAuth, getOrders);
orderRouter.get("/all/:_id", checkAuth, getOrderById);
orderRouter.put("/all/:_id", checkAuth, updateOrderStatus);
orderRouter.delete("/delete", checkAuth, deleteOrder);

orderRouter.post("/create", createOrder);
orderRouter.post("/webhook/payos", verifyWebhookData);

orderRouter.use(checkAuth);
orderRouter.get("/", OrderController.getAllOrders);
orderRouter.get("/active", OrderController.getActiveOrders);
orderRouter.get("/stats", OrderController.getOrderStats);
orderRouter.get("/status/:status", OrderController.getOrdersByStatus);
orderRouter.get("/:orderId", OrderController.getOrderById);
orderRouter.post("/fake-delivery/:orderId", OrderController.fakeDeliveryUpdate);
orderRouter.post(
  "/:orderId/cancel",
  OrderController.cancelOrder.bind(OrderController)
);

export default orderRouter;
