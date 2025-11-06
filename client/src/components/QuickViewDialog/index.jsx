import { useContext, useState } from "react";
import { MyContext } from "../../Context/MyContext";
import {  X } from "lucide-react";
import ImageSlider from "../ImageSlider";
import ProductDetailContent from "../ProductDetailContent/index.jsx";

const QuickViewDialog = () => {
  const { selectedProduct, setSelectedProduct } = useContext(MyContext);
  if (!selectedProduct) return null;

  const [selectedVariant, setselectedVariant] = useState(
    selectedProduct.variants[0]
  );
  const [selectedAttr, setSelectedAttr] = useState(
    selectedVariant.attributes[0]
  );

  const handelCloseQuickView = () => {
    setSelectedProduct(null);
  };

  return (
    <div
      className="fixed z-100 inset-0 flex justify-center items-center bg-black/40"
      onClick={handelCloseQuickView}
    >
      <div
        className="rounded-lg z-200 bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-3">
          <button
            className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
            onClick={handelCloseQuickView}
          >
            <X />
          </button>
        </div>
        <div className="flex md:flex-row flex-col gap-10">
          <div className="">
            <ImageSlider images={selectedVariant.images} />
          </div>
          <div className="min-w-120">
            <ProductDetailContent
              selectedProduct={selectedProduct}
              selectedAttr={selectedAttr}
              selectedVariant={selectedVariant}
              setselectedVariant={setselectedVariant}
              setSelectedAttr={setSelectedAttr}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewDialog;
