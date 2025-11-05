import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useProductStore from "../stores/useProductStore";
import { toast } from "react-toastify";

const useFetchProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loadingProduct, setLoadingProduct] = useState(true);

  const { setProducts } = useProductStore();

  const fetchProducts = async () => {
    try {
      setLoadingProduct(true);
      const res = await axiosPrivate.get("/api/product");
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu sản phẩm thất bại");
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { loadingProduct };
};

export default useFetchProduct;
