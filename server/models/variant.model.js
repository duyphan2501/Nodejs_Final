import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: String,
    color: String,
    image: [String],
    price: Number,
    inStock: Number,
  },
  { timestamps: true, collection: "variants" }
);

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel
