import express from "express"
import { createOrder, verifyWebhookData } from "../controllers/order.controller.js"

const orderRouter = express.Router()

orderRouter.post("/create", createOrder)
orderRouter.post("/webhook/payos", verifyWebhookData)

export default orderRouter