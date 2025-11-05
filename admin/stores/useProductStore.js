import { create } from "zustand";
import axiosPrivate from "../API/axiosPrivate";

const useProductStore = create((set) => ({
  products: [],
  term: "",
  setProducts: (products) => set({ products }),

  getProducts: async () => {
    try {
      const res = await axiosPrivate.get("/api/product/");
      set(() => ({
        products: res.data.products,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu sản phẩm thất bại");
    }
  },
  setTerm: (term) => set({ term }),
}));

export default useProductStore;
