// routes/couponRoutes.js
import express from "express";
import * as couponController from "../controllers/coupon.controller.js";

const router = express.Router();

// Route lấy tất cả coupons (có thể có query params để filter)
router.get("/", couponController.getCoupons);

// Route lấy coupon theo ID
router.get("/:id", couponController.getCouponById);

// Route cập nhật coupon
router.put("/:id", couponController.updateCoupon);

router.post("/", couponController.createCoupon);

// Route xóa coupon theo ID
router.delete("/:id", couponController.deleteCoupon);

// Route xóa nhiều coupons
router.post("/delete-many", couponController.deleteManyCoupons);

export default router;
