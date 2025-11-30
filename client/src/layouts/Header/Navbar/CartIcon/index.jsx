import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../../../store/useCartStore";
import { FaRegTrashAlt } from "react-icons/fa";
import QuantityMenu from "../../../../components/QuantityMenu/index.jsx";
import useUserStore from "../../../../store/useUserStore.js";
import { Button } from "@mui/material";
import {
  calculateDiscountedPrice,
  calculateTotal,
} from "../../../../utils/calculatePrice.js";

const CartIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const deleteItem = useCartStore((state) => state.deleteItem);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const user = useUserStore((state) => state.user);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };
  
  const handleRemoveItem = async (variantId, size) => {
    await deleteItem(user?._id, variantId, size);
  };

  const handleQuantityChange = async (variantId, size, quantity) => {
    await updateCartItem(user?._id, variantId, size, quantity);
  };

  const total = calculateTotal(cartItems);
  return (
    <div className="relative">
      {/* Cart Icon */}
      <button
        className="p-2 hover:bg-gray-100 rounded relative block cursor-pointer"
        onClick={() => setIsHovered((prev) => !prev)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>

        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems?.length || 0}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isHovered && (
        <div className="absolute right-0 top-full w-96 bg-white shadow-2xl border border-gray-200 z-50 rounded-lg">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                GIỎ HÀNG ({cartItems?.length || 0})
              </h3>
              <div
                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => setIsHovered(false)}
              >
                <X />
              </div>
            </div>

            {cartItems?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p>Giỏ hàng trống</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="max-h-96 overflow-y-auto mb-4 scroll">
                  {cartItems?.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 relative">
                        <a href={`/product/${item.slug}`}>
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${
                              item.image
                            }`}
                            alt={item.name}
                            className="size-full object-cover flex-shrink-0"
                          />
                        </a>
                        {item.inStock === 0 && (
                          <div className="size-full bg-black/30 flex items-center inset-0 absolute justify-center">
                            <p className="p-1 rounded-md bg-white text-red-500 title uppercase font-semibold">
                              Hết hàng
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm font-semibold mb-1 truncate line-clamp-1"
                          title={`${item.name} - ${item.color}`}
                        >
                          {item.name} - {item.color}
                        </h4>

                        <p className="text-xs text-gray-600 mb-1">
                          Size: {item.size}
                        </p>
                        <div className="text-sm my-1">
                          <QuantityMenu
                            quantity={item.quantity}
                            handleChange={(value) =>
                              handleQuantityChange(
                                item.variantId,
                                item.size,
                                value
                              )
                            }
                          />
                        </div>
                        <p className="text-sm font-semibold money">
                          {formatPrice(
                            calculateDiscountedPrice(item.price, item.discount)
                          )}
                        </p>
                      </div>
                      <button
                        className="p-1 hover:bg-gray-200 rounded h-fit cursor-pointer"
                        onClick={() =>
                          handleRemoveItem(item.variantId, item.size)
                        }
                      >
                        <FaRegTrashAlt size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-lg money">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                {/* summary button */}
                <div className="flex justify-center">
                  <Button
                    component={Link}
                    to={"/cart"}
                    className="!w-full !bg-black !text-white !font-semibold"
                    onClick={() => setIsHovered(!isHovered)}
                  >
                    Tóm tắt giỏ hàng
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
