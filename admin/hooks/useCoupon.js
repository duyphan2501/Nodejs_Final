// hooks/useCoupon.js
import { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useCouponStore from "../stores/useCouponStore";

const useCoupon = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setCoupons, updateCouponInStore, addCoupon } = useCouponStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tạo coupon mới
  const createCoupon = async (couponData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.post("api/coupon", couponData);

      if (response.data.success) {
        addCoupon(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo coupon");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả coupons
  const fetchCoupons = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get("api/coupon", { params });

      if (response.data.success) {
        setCoupons(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách coupon");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy coupon theo ID
  const fetchCouponById = async (couponId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get(`api/coupon/${couponId}`);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải coupon");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật coupon
  const updateCoupon = async (couponId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.put(
        `api/coupon/${couponId}`,
        updateData
      );

      if (response.data.success) {
        updateCouponInStore(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật coupon");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCoupon,
    fetchCoupons,
    fetchCouponById,
    updateCoupon,
    loading,
    error,
  };
};

export default useCoupon;
