import CouponModel from "../models/coupon.model.js";

export const getAllCoupons = async () => {
  return await CouponModel.find();
};

export const getCouponByCode = async (code) => {
  return await CouponModel.findOne({ code });
};

export const createCoupon = async (data) => {
  const coupon = new CouponModel(data);
  return await coupon.save();
};

export const updateCoupon = async (id, data) => {
  return await CouponModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCoupon = async (id) => {
  return await CouponModel.findByIdAndDelete(id);
};
