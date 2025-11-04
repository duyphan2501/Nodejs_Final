import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true, trim: true },
    images: {
      type: [String],
      required: true,
      validate: [
        (v) => v.length > 0,
        "A variant must have at least one image.",
      ],
    },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    attributes: {
      type: [
        {
          inStock: { type: Number, required: true, min: 0 },
          size: { type: String, required: true, trim: true },
        },
      ],
      required: true,
      validate: [
        (v) => v.length > 0,
        "A variant must have at least one attribute.",
      ],
      _id: false,
    },
  },
  { timestamps: true, collection: "variants" }
);

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel;
