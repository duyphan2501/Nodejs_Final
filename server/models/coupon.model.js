import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    remainingUsage: { type: Number, default: 0, max: 10 },

    discountPercent: { type: Number },

    discountAmount: { type: Number, default: 0 },

    maxDiscountAmount: { type: Number, default: 0 },

    status: { type: String, enum: ["active", "inactive"], default: "active" },

    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
      required: true,
    },

    order: [{type: String}],

    minOrderValue: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "coupons" }
);

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel;
