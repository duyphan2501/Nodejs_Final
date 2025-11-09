import createHttpError from "http-errors";
import {
  createNewOrder,
  deleteManyOrder,
  getAllOrder,
} from "../services/order.service.js";
import { removeCartItem } from "../services/cart.service.js";
import dotenv from "dotenv";
import { payOS } from "../config/payos.init.js";
import OrderModel from "../models/order.model.js";

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
      { status: req.body.status }
    );

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

export {
  createOrder,
  verifyWebhookData,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
};
