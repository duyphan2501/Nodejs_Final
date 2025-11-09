import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  verifyWebhookData,
} from "../controllers/order.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.post("/webhook/payos", verifyWebhookData);

//Admin
orderRouter.get("/", checkAuth, getOrders);
orderRouter.get("/:_id", getOrderById);
orderRouter.put("/:_id", checkAuth, updateOrderStatus);
orderRouter.delete("/delete", checkAuth, deleteOrder);

export default orderRouter;
