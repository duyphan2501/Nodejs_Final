import { useContext, useState } from "react";
import { MyContext } from "../../Context/MyContext";
import { ShoppingCart, X } from "lucide-react";
import ImageSlider from "../ImageSlider";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import { getDiscountedPrice } from "../../utils/formatMoney";
import StackButton from "../StackButton";
import QuantityDetailBtn from "../QuantityDetailBtn/index.jsx";

const QuickViewDialog = () => {
  const { selectedProduct, setSelectedProduct } = useContext(MyContext);
  if (!selectedProduct) return null;

  const [selectedVariant, setselectedVariant] = useState(
    selectedProduct.variants[0]
  );
  const [selectedAttr, setSelectedAttr] = useState(
    selectedVariant.attributes[0]
  );

  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant.price;
  const discount = selectedVariant.discount || 0;
  const { formatedPrice, formatedDiscountedPrice } = getDiscountedPrice(
    price,
    discount
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
        <div className="flex gap-10">
          <div className="">
            <ImageSlider images={selectedVariant.images} />
          </div>
          <div className="min-w-120 flex flex-col gap-3">
            <div className="">
              <h6 className="subtitle text-gray-600 text-sm">
                {selectedProduct.category}
              </h6>
              <h5 className="title font-semibold text-2xl">
                {selectedProduct.name}
              </h5>
            </div>
            <div className="flex gap-1 items-center">
              <Stack spacing={1}>
                <Rating
                  name="half-rating"
                  defaultValue={2.5}
                  precision={0.5}
                  readOnly
                />
              </Stack>
              <div className="text-gray-700">({1} Đánh giá)</div>
            </div>
            <p className="max-w-120">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum
              saepe, labore eligendi eius voluptas, beatae minus cum modi error
              quam, expedita eos itaque laudantium!
            </p>
            {/*  */}
            <div className="flex items-center gap-3 font-bold text-lg">
              <p>Giá: </p>{" "}
              <p
                className={`money ${
                  discount !== 0 && "line-through text-sm text-gray-500"
                }`}
              >
                {formatedPrice}
              </p>
              {discount !== 0 && (
                <p className="money text-highlight">
                  {formatedDiscountedPrice}
                </p>
              )}
            </div>
            {/*  */}
            <div className="">
              <p className="font-semibold mb-2">
                Màu sắc: {selectedVariant.color}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants &&
                  selectedProduct.variants.map((variant) => (
                    <div
                      className={`size-15 relative cursor-pointer group`}
                      key={variant._id}
                      onClick={() => setselectedVariant(variant)}
                    >
                      <img
                        src={variant.images[0]}
                        alt=""
                        className="size-full object-cover"
                      />
                      <div
                        className={`h-[3px] absolute z-10 bottom-0 bg-black w-full group-hover:visible ${
                          selectedVariant._id === variant._id
                            ? "visible"
                            : "invisible"
                        }`}
                      ></div>
                    </div>
                  ))}
              </div>
            </div>
            {/*  */}
            <div className="">
              <p className="font-semibold mb-2">Kích cỡ: {selectedAttr.size}</p>
              <div className="flex items-center gap-2 flex-nowrap">
                {selectedVariant &&
                  selectedVariant.attributes?.map((attr) => (
                    <div
                      className={`px-3 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white font-bold border-2 flex items-center justify-center ${
                        selectedAttr.size === attr.size && "bg-black text-white"
                      }`}
                      onClick={() => setSelectedAttr(attr)}
                      key={attr.size}
                    >
                      {attr.size}
                    </div>
                  ))}
              </div>
            </div>
            {/*  */}
            <div className="flex items-center gap-4">
              <QuantityDetailBtn
                quantity={quantity}
                setQuantity={(val) => setQuantity(val)}
              />
              <StackButton
                label={"Thêm vào giỏ hàng"}
                theme="dark"
                icon={<ShoppingCart size={18} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewDialog;
