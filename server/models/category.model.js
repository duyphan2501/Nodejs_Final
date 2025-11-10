import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    image: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    parentSlug: { type: String },
  },
  { timestamps: true, collection: "categories" }
);

categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

categorySchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isModified("parentId")) {
    if (this.parentId) {
      const parent = await this.constructor.findById(this.parentId);
      if (parent) {
        this.parentSlug = parent.slug;
        this.slug = `${parent.slug}/${slugify(this.name, {
          lower: true,
          strict: true,
        })}`;
      }
    } else {
      this.parentSlug = null;
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
  next();
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
