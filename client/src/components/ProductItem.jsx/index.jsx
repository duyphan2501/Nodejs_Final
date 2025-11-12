import Button from "@mui/material/Button";
import { getDiscountedPrice } from "../../utils/formatMoney.js";
import { BiCartAdd } from "react-icons/bi";
import { Heart, ScanEye } from "lucide-react";
import MyTooltip from "../MyTooltip/index.jsx";
import { useContext, useEffect, useMemo, useState } from "react";
import { MyContext } from "../../Context/MyContext.jsx";
import VariantImageHover from "../VariantImageHover/index.jsx";
import AttributeMenu from "../AttributeMenu/index.jsx";

const ProductItem = ({ product, addCart }) => {
  if (!product) return;
  const { setSelectedProduct } = useContext(MyContext);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedAttr, setSelectedAttr] = useState(
    selectedVariant.attributes[0]
  );

  useEffect(() => {
    if (selectedVariant && selectedVariant.attributes.length > 0) {
      setSelectedAttr(selectedVariant.attributes[0]);
    }
  }, [selectedVariant]);

  const { price, discount } = selectedVariant;

  const calculatedPrices = useMemo(() => {
    const originalPrice = price;
    const currentDiscount = discount || 0;

    const { formatedPrice, formatedDiscountedPrice } = getDiscountedPrice(
      originalPrice,
      currentDiscount
    );

    return {
      formatedPrice,
      formatedDiscountedPrice,
    };
  }, [price, discount]);

  const { formatedPrice, formatedDiscountedPrice } = calculatedPrices;

  const handleAddCart = async () => {
    const item = {
      variantId: selectedVariant._id,
      name: product.name,
      size: selectedAttr.size,
      price,
      discount,
      color: selectedVariant.color,
      image: selectedVariant.images[0],
      inStock: selectedAttr.inStock,
    };
    const quantity = 1;
    await addCart(item, quantity);
  };

  return (
    <div className="w-full mx-auto group flex flex-col flex-1 h-full relative ">
      <div className="relative h-[450px] sm:h-[400px] lg:h-[300px] overflow-hidden">
        <a href={`/product/${product.slug}`}>
          <img
            src={`${import.meta.env.VITE_API_URL}/${
              selectedVariant.images?.[0]
            }`}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
          {selectedVariant.images?.[1] && (
            <img
              src={selectedVariant.images?.[1]}
              alt={product?.name}
              className="w-full h-full object-cover absolute opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all z-10 inset-0 duration-200"
            />
          )}
        </a>
        <div className="bg-primary px-2 absolute top-2 left-2 z-20 title">
          Hàng mới
        </div>
      </div>
      <div className={``}>
        <div className="">
          <VariantImageHover
            variants={product.variants}
            selected={selectedVariant}
            setSelected={setSelectedVariant}
          />
        </div>
      </div>
      <div className="absolute -top-20 right-2 z-10 space-y-2 group-hover:top-2 transition-all duration-200 opacity-0   group-hover:opacity-100 hidden md:block">
        <div className="p-1 rounded-full hover:text-primary cursor-pointer transition bg-white active:bg-gray-200">
          <MyTooltip label={"Yêu thích"} position="bottom">
            <Heart />
          </MyTooltip>
        </div>
        <div
          className="p-1 rounded-full hover:text-primary cursor-pointer transition bg-white active:bg-gray-200"
          onClick={() => setSelectedProduct(product)}
        >
          <MyTooltip label={"Xem nhanh"} position="bottom">
            <ScanEye />
          </MyTooltip>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="p-2">
          <p className="line-clamp-1 font-semibold ">{product?.name}</p>
          <p className="text-sm text-gray-600">{product?.brand}</p>
          <p className="text-[13px]">{selectedVariant.color}</p>
          <div className="flex justify-between items-center">
            <div>
              {discount === 0 ? (
                <p className="font-bold money">{formatedDiscountedPrice}</p>
              ) : (
                <>
                  <p className="text-secondary font-bold text-lg money">
                    {formatedDiscountedPrice}
                  </p>
                  <span className="rounded-lg bg-gray-100 text-sm text-black p-1">
                    -{discount}%
                  </span>
                  <span className="ml-2 text-[13px] line-through align-text-top money">
                    {formatedPrice}
                  </span>
                </>
              )}
            </div>
            <div className="">
              <AttributeMenu
                attributes={selectedVariant.attributes}
                selectedAttr={selectedAttr}
                setSelectedAttr={setSelectedAttr}
              />
            </div>
          </div>
        </div>
        <Button
          startIcon={<BiCartAdd />}
          className="!bg-black !text-white !rounded-lg hover:!text-primary"
          onClick={handleAddCart}
        >
          thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
