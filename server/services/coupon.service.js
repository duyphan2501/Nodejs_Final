// services/couponService.js
import CouponModel from "../models/coupon.model.js";

// Tạo coupon mới
export const createCoupon = async (couponData) => {
  try {
    const {
      code,
      remainingUsage = 10,
      discountPercent,
      discountAmount,
      maxDiscountAmount = 0,
      status = "active",
      discountType,
      minOrderValue = 0,
    } = couponData;

    // Validate required fields
    if (!code || !discountType) {
      throw new Error("Code and discount type are required");
    }

    // Check if coupon code already exists
    const existingCoupon = await CouponModel.findOne({ code });
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    // Validate discount type
    if (discountType === "percent" && !discountPercent) {
      throw new Error("Discount percent is required for percent type");
    }
    if (discountType === "fixed" && !discountAmount) {
      throw new Error("Discount amount is required for fixed type");
    }

    // Create new coupon
    const newCoupon = new CouponModel({
      code,
      remainingUsage,
      discountPercent: discountType === "percent" ? discountPercent : 0,
      discountAmount: discountType === "fixed" ? discountAmount : 0,
      maxDiscountAmount,
      status,
      discountType,
      minOrderValue,
    });

    const savedCoupon = await newCoupon.save();
    return savedCoupon;
  } catch (error) {
    throw new Error(`Error creating coupon: ${error.message}`);
  }
};

// Lấy tất cả coupons
export const getAllCoupons = async () => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return coupons;
  } catch (error) {
    throw new Error(`Error fetching coupons: ${error.message}`);
  }
};

// Lấy coupon theo ID
export const getCouponById = async (couponId) => {
  try {
    const coupon = await CouponModel.findById(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  } catch (error) {
    throw new Error(`Error fetching coupon: ${error.message}`);
  }
};

// Cập nhật coupon
export const updateCoupon = async (couponId, updateData) => {
  try {
    const {
      code,
      remainingUsage,
      discountPercent,
      discountAmount,
      maxDiscountAmount,
      status,
      discountType,
      minOrderValue,
    } = updateData;

    // Validate discount type
    if (discountType === "percent" && !discountPercent) {
      throw new Error("Discount percent is required for percent type");
    }
    if (discountType === "fixed" && !discountAmount) {
      throw new Error("Discount amount is required for fixed type");
    }

    // Validate remaining usage
    if (
      remainingUsage !== undefined &&
      (remainingUsage < 0 || remainingUsage > 10)
    ) {
      throw new Error("Remaining usage must be between 0 and 10");
    }

    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      couponId,
      {
        code,
        remainingUsage,
        discountPercent,
        discountAmount,
        maxDiscountAmount,
        status,
        discountType,
        minOrderValue,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      throw new Error("Coupon not found");
    }

    return updatedCoupon;
  } catch (error) {
    throw new Error(`Error updating coupon: ${error.message}`);
  }
};

// Lấy coupons với filter và pagination
export const getCouponsWithFilter = async (
  filters = {},
  page = 1,
  limit = 20
) => {
  try {
    const { status, discountType, minOrderValue } = filters;

    const query = {};
    if (status) query.status = status;
    if (discountType) query.discountType = discountType;
    if (minOrderValue) query.minOrderValue = { $gte: minOrderValue };

    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      CouponModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CouponModel.countDocuments(query),
    ]);

    return {
      coupons,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error(`Error fetching coupons with filter: ${error.message}`);
  }
};
