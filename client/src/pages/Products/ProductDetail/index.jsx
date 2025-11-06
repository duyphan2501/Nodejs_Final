import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../../../store/useProductStore";
import ImageSlider from "../../../components/ImageSlider";
import ProductDetailContent from "../../../components/ProductDetailContent";
import Comment from "../../../components/Comment";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setselectedVariant] = useState(null);
  const [selectedAttr, setSelectedAttr] = useState(null);

  const { getProductBySlug } = useProductStore();

  useEffect(() => {
    const getProduct = async () => {
      let fetchProduct = await getProductBySlug(slug);
      const variant = fetchProduct.variants[0]
      const attribute = variant.attributes[0]
      setProduct(fetchProduct);
      setselectedVariant(variant)
      setSelectedAttr(attribute)
    };
    getProduct();
  }, [slug, getProductBySlug]);

  return (
    <>
      {product && (
        <div className="bg-white my-5">
          <div className="container">
            <section className="lg:flex gap-5 py-5">
              <section className="mb-5 lg:mb-0">
                <ImageSlider isDetail={true} images={selectedVariant?.images} />
              </section>
              <section>
                <ProductDetailContent selectedProduct={product} selectedAttr={selectedAttr} selectedVariant={selectedVariant} setSelectedAttr={setSelectedAttr} setselectedVariant={setselectedVariant}/>
              </section>
            </section>
            <section className="mt-10">
              <Comment />
            </section> 
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
