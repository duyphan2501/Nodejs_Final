import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    label: String,
    images: [String],
    attribute: [
      {
        basePrice: Number,
        discount: Number,
        sellPrice: Number,
        inStock: [
          {
            size35: Number,
            size36: Number,
            size37: Number,
            size38: Number,
            size39: Number,
            size40: Number,
            size41: Number,
            size42: Number,
            size43: Number,
            size44: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true, collection: "variants" }
);

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel;
