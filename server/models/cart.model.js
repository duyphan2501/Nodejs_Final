import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        _id: String,
        name: String,
        size: String,
        price: Number,
        color: String,
        image: String,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true, collection: "carts" }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
