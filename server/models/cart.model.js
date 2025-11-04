import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
        inStock: Number,
        quantity: Number,
      },
    ],
  },
  { timestamps: true, collection: "carts" }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
