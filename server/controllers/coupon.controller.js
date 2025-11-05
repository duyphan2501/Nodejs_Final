// controllers/couponController.js
import createHttpError from "http-errors";
import * as couponService from "../services/coupon.service.js";
import CouponModel from "../models/coupon.model.js";

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

// Lấy tất cả coupons
export const getCoupons = async (req, res) => {
  try {
    const { page, limit, status, discountType, minOrderValue, search } =
      req.query;

    if (page && limit) {
      const filters = { status, discountType, minOrderValue, search };
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

// ← THÊM FUNCTION NÀY
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

// Xóa coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await couponService.deleteCoupon(id);
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa nhiều coupons
export const deleteManyCoupons = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of coupon IDs",
      });
    }

    const result = await couponService.deleteManyCoupons(ids);
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} coupons deleted successfully`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) throw createHttpError.BadRequest("Vui lòng nhập mã khuyến mãi");
    if (!orderAmount)
      throw createHttpError.BadRequest("Vui lòng nhập số tiền đơn hàng");

    const coupon = await CouponModel.findOne({ code: code });

    if (!coupon) throw createHttpError.NotFound("Mã giảm giá không tồn tại.");

    if (coupon.status !== "active")
      throw createHttpError.BadRequest("Mã giảm giá này hiện không khả dụng.");

    if (coupon.remainingUsage < 1)
      throw createHttpError.BadRequest("Mã giảm giá đã hết lượt sử dụng.");

    if (orderAmount < coupon.minOrderValue)
      throw createHttpError.BadRequest(
        `Đơn hàng tối thiểu để áp dụng mã này là ${coupon.minOrderValue} VNĐ.`
      );

    return res.status(200).json({
      success: true,
      message: "Áp dụng mã thành công!",
      couponData: coupon,
    });
  } catch (error) {
    next(error);
  }
};
