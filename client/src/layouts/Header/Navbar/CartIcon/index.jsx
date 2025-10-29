import { X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../../../store/useCartStore";

const CartIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItem = useCartStore((state) => state.setCartItem);

  const handleRemoveItem = (id) => {
    setCartItem(cartItems.filter((item) => item.id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = calculateTotal();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cart Icon */}
      <Link to="/cart" className="p-2 hover:bg-gray-100 rounded relative block">
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

        {/* Badge số lượng */}
        {cartItems?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>

      {/* Dropdown Menu */}
      {isHovered && (
        <div className="absolute right-0 top-full w-96 bg-white shadow-2xl border border-gray-200 z-50 rounded-lg">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                GIỎ HÀNG ({itemCount})
              </h3>
            </div>

            {cartItems.length === 0 ? (
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
                <div className="max-h-96 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold mb-1 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          Size: {item.size}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          SL: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        className="p-1 hover:bg-gray-200 rounded h-fit"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-lg">{formatPrice(total)}</span>
                  </div>
               
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