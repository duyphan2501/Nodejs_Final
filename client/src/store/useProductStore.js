import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useProductStore = create((set) => {
  const getProductBySlug = async (slug) => {
    try {
      const res = await API.get(`/api/product/${slug}`);
      return res.data?.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
    }
  };

  return {
    getProductBySlug
  }
});

export default useProductStore;
