import { create } from "zustand";
import axiosPrivate from "../API/axiosPrivate";
import { toast } from "react-toastify";

const useCategoryStore = create((set) => {
  const setShoeCategories = (categories) => {
    set({
      shoeCategories: categories,
    });
  };
  const setBackpackCategories = (categories) => {
    set({
      backPackCategories: categories,
    });
  };
  const setSandalCategories = (categories) => {
    set({
      sandalCategories: categories,
    });
  };

  const setSearchTerm = (term) => {
    set({
      searchTerm: term,
    });
  };

  const getCategories = async () => {
    try {
      const [shoeRes, sandalRes, backpackRes] = await Promise.all([
        axiosPrivate.get("/api/category/shoe"),
        axiosPrivate.get("/api/category/sandal"),
        axiosPrivate.get("/api/category/backpack"),
      ]);

      set(() => ({
        shoeCategories: shoeRes.data.categories,
        sandalCategories: sandalRes.data.categories,
        backPackCategories: backpackRes.data.categories,
      }));
    } catch (error) {
      toast.error("Tải dữ liệu danh mục thất bại", error);
    }
  };

  return {
    shoeCategories: [],
    sandalCategories: [],
    backPackCategories: [],
    searchTerm: "",

    setShoeCategories,
    setBackpackCategories,
    setSandalCategories,
    setSearchTerm,
    getCategories,
  };
});

export default useCategoryStore;
