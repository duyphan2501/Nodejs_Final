import { create } from "zustand";
import axiosPrivate from "../API/axiosPrivate";
import { toast } from "react-toastify";

const useProductStore = create((set) => ({
  products: [],
  term: "",
  shoeQuantity: 0,
  sandalQuantity: 0,
  backpackQuantity: 0,

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

  getProductStatisticQuantity: async () => {
    try {
      const res = await axiosPrivate.get(
        "/api/product/statistic/parent-category"
      );
      set(() => ({
        shoeQuantity:
          res.data.result.find((v) => v.parentName === "Giày")?.total || 0,
        sandalQuantity:
          res.data.result.find((v) => v.parentName === "Dép")?.total || 0,
        backpackQuantity:
          res.data.result.find((v) => v.parentName === "Balo")?.total || 0,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu thống kê sản phẩm thất bại");
    }
  },
}));

export default useProductStore;
