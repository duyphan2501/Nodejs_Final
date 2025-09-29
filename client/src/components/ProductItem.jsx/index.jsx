import Button from "@mui/material/Button";
import { getDiscountedPrice } from "../../utils/formatMoney.js";
import { BiCartAdd } from "react-icons/bi";

const ProductItem = ({ product }) => {
  const price = product.variants[0].price;
  const discount = product.variants[0].discount || 0;
  const { formatedPrice, formatedDiscountedPrice } = getDiscountedPrice(
    price,
    discount
  );
  console.log(formatedPrice);
  console.log(formatedDiscountedPrice);
  return (
    <div className="w-full mx-auto group flex flex-col flex-1 h-full">
      <div className="relative h-[450px] sm:h-[400px] lg:h-[300px] overflow-hidden">
        <img
          src={product?.variants?.[0]?.image?.[0]}
          alt={product?.name}
          className="w-full h-full object-cover"
        />
        {product?.variants?.[0]?.image?.[1] && (
          <img
            src={product?.variants?.[0]?.image?.[1]}
            alt={product?.name}
            className="w-full h-full object-cover absolute invisible group-hover:visible group-hover:scale-105 transition-all z-10 inset-0 duration-200"
          />
        )}
        <div className="bg-primary px-2 absolute top-2 left-2 z-20 title">Hàng mới</div>
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="p-2">
          <p className="line-clamp-1 font-semibold ">{product?.name}</p>
          <p className="text-sm text-gray-600">{product?.category}</p>
          <p className="text-[13px]">{product?.variants.length} Colours</p>
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
        </div>
        <Button
          startIcon={<BiCartAdd />}
          className="!bg-black !text-white !rounded-lg hover:!text-primary"
        >
          thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
