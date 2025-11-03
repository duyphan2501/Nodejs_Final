import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    orderCode: { type: Number, required: true, unique: true },
    orderId: { type: String, required: true, unique: true },
    shippingInfo: {
      ward: String,
      province: String,
      addressDetail: String,
      phone: String,
      receiver: String,
    },
    items: [
      {
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: true,
        },
        name: String,
        size: String,
        price: Number,
        discount: Number,
        color: String,
        image: String,
        quantity: Number,
      },
    ],
    subTotal: {type: Number, required: true},
    itemsDiscounted: {type: Number, required: true},
    payment: {
      provider: String,
      status: String,
    },
    status: { type: String, default: "pending" },
    couponCode: { code: String, amountReduced: Number },
    usedPoint: { point: Number, amountReduced: Number },
  },
  { timestamps: true, collection: "orders" }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
