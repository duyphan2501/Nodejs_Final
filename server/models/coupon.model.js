import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    remainingUsage: { type: Number, default: 0, max: 10 },
    discountPercent: { type: Number, required: true },
  },
  { timestamps: true, collection: "coupons" }
);

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel
