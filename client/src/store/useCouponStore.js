import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useCouponStore = create((set) => {
  const applyCoupon = async (code, orderAmount) => {
    set({isCouponLoading: true})
    try {
      const res = await API.post("/api/coupon/apply", { code, orderAmount });
      toast.success(res.data.message)
      return res.data.couponData;
    } catch (error) {
      toast.error(error.response.data.message || "Lỗi server");
    } finally {
        set({isCouponLoading: false})
    }
  };

  return {
    isCouponLoading: false,
    applyCoupon,
  };
});

export default useCouponStore;
