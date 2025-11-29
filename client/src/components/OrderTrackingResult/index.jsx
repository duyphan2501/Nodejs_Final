import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";

const OrderTrackingResult = ({ currentOrder, loading }) => {
  const [error, setError] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Đã giao":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "Đang vận chuyển":
        return <Truck className="w-6 h-6 text-blue-600" />;
      case "Đã xác nhận":
        return <Package className="w-6 h-6 text-purple-600" />;
      default:
        return <Clock className="w-6 h-6 text-orange-600" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-50 border-green-500";
      case "Đang vận chuyển":
        return "bg-blue-50 border-blue-500";
      case "Đã xác nhận":
        return "bg-purple-50 border-purple-500";
      default:
        return "bg-orange-50 border-orange-500";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!currentOrder || Object.keys(currentOrder).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold text-gray-600">
            {error || "Không tìm thấy đơn hàng"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Ngày đặt hàng</h3>
            </div>
            <p className="text-lg font-semibold">{currentOrder?.date}</p>
            <p className="text-sm text-gray-600">{currentOrder?.time}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">
                {currentOrder?.deliveryDate ? "Đã giao" : "Dự kiến giao hàng"}
              </h3>
            </div>
            <p className="text-lg font-semibold">
              {currentOrder?.deliveryDate ||
                currentOrder?.estimatedDelivery ||
                "Đang cập nhật"}
            </p>
            <p className="text-sm text-gray-600">Giao hàng tiêu chuẩn</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Tổng tiền</h3>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(currentOrder?.total)}
            </p>
            <p className="text-sm text-gray-600">
              {currentOrder?.paymentMethod}
            </p>
          </div>
        </div>

        {/* Trạng thái đơn hàng */}
        {/* Trạng thái đơn hàng */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-6 uppercase">
            Trạng thái đơn hàng
          </h3>

          <div className="space-y-4">
            {currentOrder?.statusHistory?.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-5 rounded-lg border-l-4 ${getStatusColorClass(
                  item.status
                )}`}
              >
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <p className="font-bold text-lg">{item.status}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Cập nhật lúc: {item.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-4 uppercase">Sản phẩm</h3>
          <div className="space-y-4">
            {currentOrder?.products.map((product, idx) => (
              <div
                key={idx}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {product.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-3xl">👟</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">{product.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Màu sắc: {product.color}</p>
                    {product.size && <p>Size: {product.size}</p>}
                    <p>Số lượng: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">TỔNG CỘNG:</p>
              <p className="font-bold text-2xl">
                {formatCurrency(currentOrder?.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold uppercase">Địa chỉ giao hàng</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">
                {currentOrder?.shippingAddress.name}
              </p>
              <p>{currentOrder?.shippingAddress.phone}</p>
              <p>{currentOrder?.shippingAddress.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold uppercase">Phương thức thanh toán</h3>
            </div>
            <p className="text-gray-700">{currentOrder?.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingResult;
