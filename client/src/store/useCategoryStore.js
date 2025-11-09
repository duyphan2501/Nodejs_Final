import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useCategoryStore = create((set) => {
  const getListCategories = async () => {
    try {
      const res = await API.get("/api/category/list");
      return res.data.categories;
    } catch (error) {
      toast.error(error);
    }
  };

  return {
    getListCategories
  }
});

export default useCategoryStore;
