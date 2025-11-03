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

  const deleteItem = async (userId, variantId, size) => {
    try {
      const res = await API.delete(`/api/cart/delete`, {
        data: { userId, variantId, size },
      });
      setCartItems(res.data.cart.items);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Xoá thất bại");
    }
  };
  const updateCartItem = async (userId, variantId, size, quantity) => {
    try {
      const res = await API.put(`/api/cart/update`, {
        userId,
        variantId,
        size,
        quantity
      });
      setCartItems(res.data.cart.items);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Cập nhật thất bại");
    }
  };

  return {
    cartItems: [],
    setCartItems,
    addToCart,
    clearCartItems,
    getCart,
    deleteItem,
    updateCartItem,
  };
});

export default useCartStore;
