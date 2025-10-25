import { Link } from "react-router-dom";
import useCartStore from "../../../../store/useCartStore";

const CartIcon = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded relative">
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
  );
};

export default CartIcon;
