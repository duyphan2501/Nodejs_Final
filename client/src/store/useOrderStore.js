import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useOrderStore = create((set) => {
  const createOrder = async (
    cartItems,
    email,
    address,
    provider,
    coupon,
    usedPoint,
    subTotal,
    itemsDiscounted
  ) => {
    set({ isLoading: true });
    try {
      const res = await API.post("/api/order/create", {
        cartItems,
        email,
        address,
        provider,
        coupon,
        usedPoint,
        subTotal,
        itemsDiscounted,
      });
      toast.success(res.data.message);
      set({ order: res.data.order });
      const url = res.data.url;
      if (url) window.location.href = url;
      else window.location.href = "/order/success";
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Tạo đơn hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    isLoading: false,
    order: null,
    createOrder,
  };
});

export default useOrderStore;
