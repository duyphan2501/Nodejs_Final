import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useCategoryStore from "../stores/useCategoryStore";
import { toast } from "react-toastify";

const useFetchCategory = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loadingCategory, setLoadingCategory] = useState(true);

  const { setShoeCategories, setSandalCategories, setBackpackCategories } =
    useCategoryStore();

  const fetchCategories = async () => {
    try {
      const [shoeRes, sandalRes, backpackRes] = await Promise.all([
        axiosPrivate.get("/api/category/shoe"),
        axiosPrivate.get("/api/category/sandal"),
        axiosPrivate.get("/api/category/backpack"),
      ]);

      setShoeCategories(shoeRes.data.categories);
      setSandalCategories(sandalRes.data.categories);
      setBackpackCategories(backpackRes.data.categories);
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu danh mục thất bại");
    } finally {
      setLoadingCategory(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { loadingCategory };
};

export default useFetchCategory;
