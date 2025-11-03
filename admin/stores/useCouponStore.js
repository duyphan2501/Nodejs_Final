// stores/useCouponStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCouponStore = create(
  persist(
    (set, get) => ({
      coupons: [],
      selectedCoupon: null,

      // Set danh sách coupons
      setCoupons: (coupons) => set({ coupons }),

      // Thêm coupon vào store (nếu cần trong tương lai)
      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [coupon, ...state.coupons],
        })),

      // Cập nhật coupon trong store
      updateCouponInStore: (updatedCoupon) =>
        set((state) => ({
          coupons: state.coupons.map((coupon) =>
            coupon._id === updatedCoupon._id ? updatedCoupon : coupon
          ),
        })),

      // Xóa coupon khỏi store (nếu cần trong tương lai)
      removeCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.filter((coupon) => coupon._id !== couponId),
        })),

      // Set coupon được chọn
      setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),

      // Clear selected coupon
      clearSelectedCoupon: () => set({ selectedCoupon: null }),

      // Lấy coupon theo ID từ store
      getCouponById: (couponId) => {
        const state = get();
        return state.coupons.find((coupon) => coupon._id === couponId);
      },

      // Filter coupons theo status
      getCouponsByStatus: (status) => {
        const state = get();
        return state.coupons.filter((coupon) => coupon.status === status);
      },

      // Clear tất cả coupons
      clearCoupons: () => set({ coupons: [], selectedCoupon: null }),
    }),
    {
      name: "coupon-storage",
      partialize: (state) => ({
        coupons: state.coupons,
      }),
    }
  )
);

export default useCouponStore;
