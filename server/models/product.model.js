import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    inputPrice: { type: mongoose.Schema.Types.Number },
    description: { type: String },
  },
  { timestamps: true, collection: "products" }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
