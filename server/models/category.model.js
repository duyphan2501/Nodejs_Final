import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, collection: "categories" }
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
