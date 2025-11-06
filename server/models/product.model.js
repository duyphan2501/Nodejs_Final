import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    inputPrice: { type: Number, required: true },
    description: { type: String },
    slug: { type: String, unique: true },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true, collection: "products" }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    // Only generate slug if name is changed
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
