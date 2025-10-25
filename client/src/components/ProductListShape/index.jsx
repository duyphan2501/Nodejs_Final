import { memo, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, ScanEye, ShoppingCart } from "lucide-react";
import { Rating, Stack } from "@mui/material";
import { getDiscountedPrice } from "../../utils/formatMoney.js";
import MyTooltip from "../MyTooltip/index.jsx";
import StackButton from "../StackButton/index.jsx";
import { MyContext } from "../../Context/MyContext.jsx";


// Tách các sub-component nhỏ hơn để dễ quản lý và tối ưu hóa
const AddToCartButton = memo(() => (
  <div className="w-fit">
    <StackButton
      label={"Thêm vào giỏ hàng"}
      theme="dark"
      icon={<ShoppingCart size={18} />}
    />
  </div>
));

const ProductListShape = memo(({ product }) => {
  const { setSelectedProduct } = useContext(MyContext);

  const { description, name, rating, price, discount, image1, image2, isNew } =
    useMemo(() => {
      const desc = product.description || "No description available.";
      const prodName = product.name || "Unnamed Product";
      const img1 = product.variants?.[0]?.images?.[0] || "";
      const img2 = product.variants?.[0]?.images?.[1] || "";
      const prodRating = product.rating || 5;
      const prodPrice = product.variants?.[0]?.attribute?.[0]?.price || 0;
      const prodDiscount = product.variants?.[0]?.attribute?.[0]?.discount || 0;
      const isNewProd =
        (Date.now() - (product.variants?.[0].create_at || Date.now())) /
          (1000 * 60 * 60 * 24) <
        7;

      return {
        description: desc,
        name: prodName,
        rating: prodRating,
        price: prodPrice,
        discount: prodDiscount,
        image1: img1,
        image2: img2,
        isNew: isNewProd,
      };
    }, [product]);

  const { formatedPrice, formatedDiscountedPrice } = useMemo(
    () => getDiscountedPrice(price, discount),
    [price, discount]
  );

  // Sử dụng useCallback để ghi nhớ hàm callback
  const handleQuickView = useCallback(() => {
    setSelectedProduct(product);
  }, [setSelectedProduct, product]);

  return (
    <div className="p-4 rounded-md shadow bg-gray-100 flex items-center gap-10 relative border border-gray-200">
      {isNew && (
        <span className="px-2 rounded-md bg-primary title text-black absolute top-3 right-4">
          Hàng mới!
        </span>
      )}

      <div className="relative group h-[300px] overflow-hidden rounded-lg">
        <Link to={"/san-pham/chi-tiet"}>
          <img
            src={image1}
            alt={name}
            className="w-full object-contain h-full rounded-lg"
            loading="lazy"
          />
          {image2 !== "" && (
            <img
              src={image2}
              alt={name}
              className="w-full object-contain h-full rounded-lg absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out cursor-pointer group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>
        <div className="!absolute !transition-all top-[-30px] opacity-0 duration-200 group-hover:top-3 group-hover:opacity-100 right-3 z-50 flex flex-col gap-2">
          <div className="p-1 rounded-full hover:text-primary cursor-pointer transition bg-white active:bg-gray-200">
            <MyTooltip label={"Yêu thích"} position="bottom">
              <Heart />
            </MyTooltip>
          </div>
          <div
            className="p-1 rounded-full hover:text-primary cursor-pointer transition bg-white active:bg-gray-200"
            onClick={handleQuickView}
          >
            <MyTooltip label={"Xem nhanh"} position="bottom">
              <ScanEye />
            </MyTooltip>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 gap-2">
        <h4 className="text-2xl text-black font-semibold font-sans">{name}</h4>
        <p className="w-[95%] line-clamp-6">{description}</p>
        <div className="">
          <Stack spacing={1}>
            <Rating
              size="small"
              name="half-rating"
              defaultValue={rating}
              precision={0.5}
              readOnly
            />
          </Stack>
        </div>
        <div className="my-2">
          {discount === 0 ? (
            <p className="font-bold text-xl money">{formatedPrice}</p>
          ) : (
            <>
              <p className="text-highlight font-bold text-xl money">
                {formatedDiscountedPrice}
              </p>
              <span className="rounded-lg text-sm bg-white text-black p-1">
                -{discount}%
              </span>
              <span className="ml-2 text-[13px] line-through align-text-top text-black money">
                {formatedPrice}
              </span>
            </>
          )}
        </div>
        <AddToCartButton />
      </div>
    </div>
  );
});

export default ProductListShape;
