// controllers/couponController.js
import * as couponService from "../services/coupon.service.js";

// Lấy tất cả coupons
export const getCoupons = async (req, res) => {
  try {
    const { page, limit, status, discountType, minOrderValue } = req.query;

    if (page && limit) {
      const filters = { status, discountType, minOrderValue };
      const result = await couponService.getCouponsWithFilter(
        filters,
        parseInt(page),
        parseInt(limit)
      );
      return res.status(200).json({
        success: true,
        message: "Coupons fetched successfully",
        data: result,
      });
    }

    const coupons = await couponService.getAllCoupons();
    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy coupon theo ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await couponService.getCouponById(id);
    res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCoupon = await couponService.updateCoupon(id, updateData);
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Tạo coupon mới
export const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;
    const newCoupon = await couponService.createCoupon(couponData);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
