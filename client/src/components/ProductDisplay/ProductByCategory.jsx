import { useEffect, useState } from "react";
import ProductSlider from "../ProductSlider.jsx";
import ViewMoreBtn from "../ViewMoreBtn";
import useProductStore from "../../store/useProductStore.js";

const ProductByCategory = ({ category }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const getProductByCategorySlug = useProductStore(
    (s) => s.getProductByCategorySlug
  );

  const fetchProductsSlug = async () => {
    setLoading(false);
    const data = await getProductByCategorySlug(6, category.slug);
    setProducts(data);
    setLoading(true);
  };

  useEffect(() => {
    fetchProductsSlug();
  }, []);
  return (
    <div>
      <section className="mb-4">
        <div className="flex justify-between items-center">
          <h4 className="title uppercase font-bold text-3xl mb-3">
            {category.name}
          </h4>
          <div className="  ">
            <ViewMoreBtn slug={category.slug} />
          </div>
        </div>
      </section>
      <ProductSlider products={products} />
    </div>
  );
};

export default ProductByCategory;
