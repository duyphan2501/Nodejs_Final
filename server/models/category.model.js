import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, collection: "categories" }
);

categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
