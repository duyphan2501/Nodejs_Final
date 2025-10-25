import { X, ArrowRight } from "lucide-react";
import Recommendations from "../ProductRecommendations";
import Code from "../UseDisCountCode";
import EmptyCart from "../EmptyCart";
import useCartStore from "../../store/useCartStore";

const CartWithItems = ({}) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(newQuantity) } : item
      )
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  const total = calculateTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}

          <div className="lg:col-span-2">
            <div className="bg-gray-200 p-4 mb-6">
              <p className="text-2xl font-semibold">XIN CHÀO, !</p>
            </div>

            <div className="bg-white p-6 mb-6">
              <h2 className="text-4xl font-bold mb-2">GIỎ HÀNG CỦA BẠN</h2>
              <p className="text-xl mb-4">
                TỔNG CỘNG ({itemCount} sản phẩm){" "}
                <strong>{formatPrice(total)}</strong>
              </p>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 p-4 border border-gray-300 mb-4 bg-white"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-[150px] h-[200px] md:h-[150px] object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-600">
                          KÍCH CỠ: {item.size}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-semibold mb-2">
                          {formatPrice(item.price)}
                        </p>
                        <button
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-auto">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-5">
              <h3 className="text-2xl font-bold mb-4">TÓM TẮT ĐƠN HÀNG</h3>

              <div className="flex justify-between mb-2 text-sm">
                <span>{itemCount} sản phẩm</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Giao hàng</span>
                <span>Miễn phí</span>
              </div>

              <hr className="border-t border-gray-300 my-4" />

              <div className="flex justify-between mb-2 text-sm font-bold">
                <span>Tổng</span>
                <span>{formatPrice(total)}</span>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                (Đã bao gồm thuế 185.185₫)
              </p>

              <Code />

              <button className="w-full bg-black text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                THANH TOÁN <ArrowRight size={16} />
              </button>

              <div className="mt-6">
                <p className="text-xs text-gray-600 mb-2">
                  PHƯƠNG THỨC THANH TOÁN ĐƯỢC CHẤP NHẬN
                </p>
                <div className="flex gap-2">
                  <div className="border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-blue-700">
                    VISA
                  </div>
                  <div className="border border-gray-300 rounded px-2 py-1">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 via-red-600 to-yellow-500" />
                  </div>
                  <div className="border border-gray-300 rounded px-2 py-1 text-base">
                    💳
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Recommendations />
      </div>
    </div>
  );
};

export default CartWithItems;
