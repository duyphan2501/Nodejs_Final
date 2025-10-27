import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: String,
    images: [String],
    attribute: [{ price: Number, inStock: Number, size: String }],
  },
  { timestamps: true, collection: "variants" }
);

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel;
