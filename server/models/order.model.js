import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderCode: { type: Number, required: true, unique: true },
    orderId: { type: String, required: true, unique: true },
    shippingInfo: {
      ward: String,
      province: String,
      addressDetail: String,
      phone: String,
      receiver: String,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    payment: {
      provider: String,
      status: String,
    },
    status: { type: String, default: "pending" },
    couponCode: { type: String },
  },
  { timestamps: true, collection: "orders" }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
