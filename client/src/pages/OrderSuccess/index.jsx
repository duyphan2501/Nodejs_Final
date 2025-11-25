import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState } from "react";
import useOrderStore from "../../store/useOrderStore";

const OrderSuccess = () => {
  const navigator = useNavigate();
  const [order, setOrder] = useState(null);
  // Lấy orderCode từ query (?orderCode=xxxx)
  const query = new URLSearchParams(location.search);
  const orderCodeQuery = query.get("orderCode");

  const user = useUserStore((state) => state.user);
  const orderStore = useOrderStore.getState();

  // Fetch order nếu PayOS redirect về mà không có state
  const fetchOrderDetails = async () => {
    const orderDetails = await orderStore.getOrderByOrderCode(orderCodeQuery);
    if (orderDetails) {
      setOrder(orderDetails);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderCodeQuery]);

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đã giao hàng";
      case "delivered":
        return "Đã nhận hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatPaymentProvider = (provider) => {
    if (provider === "cod") return "Thanh toán khi nhận hàng";
    if (provider === "payos") return "Thanh toán qua PayOS";
    return provider;
  };

  if (orderStore.isLoading) {
    return (
      <div className="p-6 text-center">Đang tải thông tin đơn hàng...</div>
    );
  }
  if (!order) {
    return (
      <div className="p-6 text-center">
        Không tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại.
      </div>
    );
  }
  console.log("order", order)

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT SIDE */}
      <div>
        <div className="flex justify-center ">
          <div className="w-20 h-20 border-4 border-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-4 text-center">
          Cảm ơn bạn đã đặt hàng!
        </h2>

        <p className="mt-2 text-gray-600">
          Mã đơn hàng #: <strong>{order.orderId}</strong>.
        </p>
        <p className="text-gray-600 mb-2">
          Dùng mã này để theo dõi đơn hàng của bạn.
        </p>

        <p className="text-gray-600">
          Chúng tôi sẽ gửi email đến <strong>{order.email}</strong> với chi tiết
          và thông tin để theo dõi đơn hàng.
        </p>

        <Link
          to="/"
          className="inline-block bg-primary text-black font-bold hover:bg-green-500 transition px-5 py-2 rounded mt-4"
        >
          Tiếp tục mua sắm
        </Link>

        {!user && (
          <div className="mt-10">
            <h3 className="text-lg font-medium">
              Tạo tài khoản cho lần mua kế tiếp
            </h3>
            <p className="text-gray-600 mb-3">Email: {order.email}</p>
            <button
              className="bg-dark hover:bg-gray-800 text-white px-5 py-2 rounded cursor-pointer"
              onClick={() =>
                navigator("/sign-up", {
                  state: { email: order.email, address: order.shippingInfo },
                })
              }
            >
              Tạo tài khoản
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="border p-5 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Tóm tắt đơn hàng</h3>

        <table className="w-full text-left text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tên sản phẩm</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Giá</th>
              <th className="p-2 border">S.L</th>
              <th className="p-2 border">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order && order?.items?.map((item) => (
              <tr key={item.productId}>
                <td className="p-2 border">{item.name} - {item.color}</td>
                <td className="p-2 border">{item.size}</td>
                <td className="p-2 border money">{formatMoney(item.price)}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border money">
                  {formatMoney(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm">
          <p className="flex justify-between">
            <span>Tổng cộng</span>
            <strong className="money">{formatMoney(order.orderAmount)}</strong>
          </p>

          <p className="flex justify-between text-lg mt-3 border-t pt-3">
            <span>Tổng tiền</span>
            <strong className="money">{formatMoney(order.orderAmount)}</strong>
          </p>
        </div>
      </div>

      {/* SHIPPING & PAYMENT INFO */}
      <div className="md:col-span-2 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold">Địa chỉ giao hàng</h4>
            <p>{order.shippingInfo?.receiver}</p>
            <p>{order.shippingInfo?.addressDetail}</p>
            <p>
              {order.shippingInfo?.ward}, {order.shippingInfo?.province}
            </p>
            <p>SĐT: {order.shippingInfo?.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold">Phương thức thanh toán</h4>
            <p>{formatPaymentProvider(order.payment?.provider)}</p>
            <p>
              Trạng thái:
              {order.payment?.status === "paid"
                ? " Đã thanh toán"
                : " Chưa thanh toán"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
