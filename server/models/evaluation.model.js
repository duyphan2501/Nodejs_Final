import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    userName: {type: String, required: true},
    rating: Number,
    comment: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true, collection: "evaluations" }
);

export default mongoose.model("Evaluation", evaluationSchema);
