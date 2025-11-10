import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const normalizeCategoryHeader = (categories) => {
  const newCategories = categories.map((category) => ({
    id: category._id,
    type: category.slug,
    title: category.name,

    featured: category.children.map((child) => ({
      name: child.name,
      image: `${import.meta.env.VITE_API_URL}/${child.image}`,
      link: `/${child.slug}`,
    })),
  }));
  return newCategories;
};

const useCategoryStore = create((set) => {
  const getListCategories = async () => {
    try {
      const res = await API.get("/api/category/list");
      set(() => ({
        categories: res.data.categories,
      }));
    } catch (error) {
      toast.error(error);
    }
  };

  const getCategoriesForHeader = async () => {
    try {
      const res = await API.get("/api/category/list");
      return normalizeCategoryHeader(res.data.categories);
    } catch (error) {
      toast.error(error);
    }
  };

  return {
    categories: [],

    getListCategories,
    getCategoriesForHeader,
  };
});

export default useCategoryStore;
