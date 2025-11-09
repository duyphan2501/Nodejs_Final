import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const cleanParams = (params) => {
  const cleaned = {};
  for (const key in params) {
    // Chỉ thêm vào nếu giá trị không rỗng, không phải null, không phải 0 mặc định (nếu 0 là default min price)
    if (
      params[key] !== "" &&
      params[key] !== null &&
      params[key] !== undefined
    ) {
      cleaned[key] = params[key];
    }
  }
  return cleaned;
};

const useProductStore = create((set) => {
  const getProductBySlug = async (slug) => {
    try {
      const res = await API.get(`/api/product/${slug}`);
      return res.data?.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
    }
  };

  const getAllBrands = async () => {
    try {
      const res = await API.get(`/api/product/brands`);
      return res.data?.brands;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get brands error");
    }
  };

  const fetchProducts = async (
    page,
    itemsPerPage,
    sortOption,
    filterParams
  ) => {
    try {
      const params = new URLSearchParams(
        cleanParams({
          page: page,
          limit: itemsPerPage,
          sort: sortOption,
        })
      );
      if (filterParams.categoryId && filterParams.categoryId.length > 0) {
        filterParams.categoryId.forEach((id) => {
          params.append("categoryId", id);
        });
      }
      if (filterParams.brand && filterParams.brand.length > 0) {
        filterParams.brand.forEach((brandName) => {
          params.append("brand", brandName);
        });
      }
      params.append("minPrice", filterParams.minPrice);
      params.append("maxPrice", filterParams.maxPrice);

      // Gọi API với đầy đủ tham số
      const res = await API.get(`/api/product/fetch?${params.toString()}`);

      return { products: res.data?.products, totalPages: res.data?.totalPages };
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
      return { products: [], totalPages: 0 };
    }
  };

  return {
    getProductBySlug,
    fetchProducts,
    getAllBrands,
  };
});

export default useProductStore;
