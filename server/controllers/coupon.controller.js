import * as couponService from "../services/coupon.services.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await couponService.getCouponByCode(code);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const newCoupon = await couponService.createCoupon(req.body);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await couponService.updateCoupon(id, req.body);
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await couponService.deleteCoupon(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
