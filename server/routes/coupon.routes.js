import express from "express";
import * as couponController from "../controllers/couponController.js";

const router = express.Router();

router.get("/", couponController.getAllCoupons);
router.get("/:code", couponController.getCouponByCode);
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

export default router;
