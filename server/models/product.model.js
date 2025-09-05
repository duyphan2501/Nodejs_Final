import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: { type: String },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true, collection: "products" }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
