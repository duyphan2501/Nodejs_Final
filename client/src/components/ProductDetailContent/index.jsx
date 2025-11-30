import { Rating, Stack } from "@mui/material";
import { useState } from "react";
import { getDiscountedPrice } from "../../utils/formatMoney";
import QuantityDetailBtn from "../QuantityDetailBtn";
import { ShoppingCart } from "lucide-react";
import StackButton from "../StackButton";
import { useEffect } from "react";
import useEvaluationStore from "../../store/useEvaluationStore";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/useUserStore";

const ProductDetailContent = ({
  selectedProduct,
  setselectedVariant,
  setSelectedAttr,
  selectedAttr,
  selectedVariant,
}) => {
  const [quantity, setQuantity] = useState(1);

  const user = useUserStore((state) => state.user);
  const { addToCart } = useCartStore();

  if (!selectedProduct || !selectedVariant || !selectedAttr) return;

  const price = selectedVariant.price;
  const discount = selectedVariant.discount || 0;
  const { formatedPrice, formatedDiscountedPrice } = getDiscountedPrice(
    price,
    discount
  );

  //Store đánh giá
  const getEvaluationsByProductId = useEvaluationStore(
    (state) => state.getEvaluationsByProductId
  );
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const averageStar = useEvaluationStore((state) => state.averageStar);

  const fetchEvaluations = async () => {
    await getEvaluationsByProductId(selectedProduct._id);
  };

  const handleAddCart = async () => {
    const item = {
      variantId: selectedVariant._id,
      name: selectedProduct.name,
      size: selectedAttr.size,
      price,
      discount,
      color: selectedVariant.color,
      image: selectedVariant.images[0],
      inStock: selectedAttr.inStock,
      slug: selectedProduct.slug,
    };
    await addToCart(item, quantity, user?._id);
  };

  useEffect(() => {
    fetchEvaluations();
  }, [selectedProduct._id]);

  return (
    <div className="flex flex-col gap-3 max-w-120 mx-auto sticky top-5">
      <div className="">
        <h6 className="subtitle text-gray-600 text-sm">
          {selectedProduct.category}
        </h6>
        <h5 className="title font-semibold text-2xl">{selectedProduct.name}</h5>
      </div>
      <div className="flex gap-1 items-center">
        <Stack spacing={1}>
          <Rating
            name="half-rating"
            value={averageStar}
            precision={0.5}
            readOnly
          />
        </Stack>
        <div className="text-gray-700">{`(${evaluations.length} đánh giá)`}</div>
      </div>
      <p
        className=""
        dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
      ></p>

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
          <p className="money text-highlight">{formatedDiscountedPrice}</p>
        )}
      </div>
      {/*  */}
      <div className="">
        <p className="font-semibold mb-2">Màu sắc: {selectedVariant.color}</p>
        <div className="flex flex-wrap gap-2">
          {selectedProduct.variants &&
            selectedProduct.variants.map((variant) => (
              <div
                className={`size-15 relative cursor-pointer group`}
                key={variant._id}
                onClick={() => setselectedVariant(variant)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/${variant.images[0]}`}
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
        <div className="flex items-center gap-4 mb-2">
          <p className="font-semibold ">Kích cỡ: {selectedAttr.size}</p>
          <div className="text-green-500 italic">
            {selectedAttr.inStock <= 0 ? (
              <span className="text-red-700">Hết hàng</span>
            ) : (
              `Trong kho: ${selectedAttr.inStock}`
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedVariant &&
            selectedVariant.attributes?.map((attr) => (
              <div
                className={`px-3 py-1 rounded-md cursor-pointer hover:bg-black hover:text-white font-bold border-2 flex items-center justify-center  ${
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
      <div className="flex items-center gap-4 mt-5">
        <QuantityDetailBtn
          quantity={quantity}
          setQuantity={(val) => setQuantity(val)}
        />
        <StackButton
          label={"Thêm vào giỏ hàng"}
          theme="dark"
          icon={<ShoppingCart size={18} />}
          handleClick={handleAddCart}
        />
      </div>
    </div>
  );
};

export default ProductDetailContent;
