import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useCartStore = create((set) => {
  const setCartItems = (items) => set({ cartItems: items });
  const clearCartItems = () => set({ cartItems: [] });

  const addToCart = async (item, quantity, userId) => {
    try {
      const res = await API.post("/api/cart/add", { item, quantity, userId });
      toast.success(res.data.message);
      setCartItems(res.data.cart.items);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Thêm thất bại");
    }
  };

  const getCart = async (userId) => {
    try {
      const res = await API.get(`/api/cart/get/${userId || "guest"}`);
      setCartItems(res.data.cart.items);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    cartItems: [],
    setCartItems,
    addToCart,
    clearCartItems,
    getCart,
  };
});

export default useCartStore;
