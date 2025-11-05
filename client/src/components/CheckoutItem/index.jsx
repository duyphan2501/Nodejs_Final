import { formatMoney } from "../../utils/formatMoney";

const CheckoutItem = ({ item }) => {
  const discountPrice = item.price * (1 - item.discount / 100);
  const discountedPrice = Math.round(discountPrice / 1000) * 1000;
  return (
    <div className="flex items-center gap-3">
      <img src={item.image} alt="" className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <div className="flex items-center  ">
          <p className="font-medium flex-1 line-clamp-1 text-gray-800">
            {item.name} - {item.color}
          </p>
          <p className="mr-1">x {item.quantity}</p>
        </div>
        <p className="text-sm text-gray-500">Kích cỡ: {item.size}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-800 money">
            {formatMoney(discountedPrice)}
          </span>
          {item.discount > 0 && (
            <span className="line-through text-gray-400 money">
              {formatMoney(item.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
