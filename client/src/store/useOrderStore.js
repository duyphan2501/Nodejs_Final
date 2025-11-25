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
    orderAmount,
    itemsDiscounted,
    userId
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
        orderAmount,
        itemsDiscounted,
        userId
      });
      toast.success(res.data.message);
      return { order: res.data.order, url: res.data.url };
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Tạo đơn hàng thất bại");
    } finally {
      set({ isLoading: false });
    }
  };

  const getOrderByOrderCode = async (orderCode) => {
    set({ isLoading: true });
    try {
      const res = await API.get(`/api/order/by-order-code/${orderCode}`);
      return res.data.result;
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    isLoading: false,
    order: null,
    createOrder,
    getOrderByOrderCode,
  };
});

export default useOrderStore;
