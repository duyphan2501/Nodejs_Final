import React from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
} from "lucide-react";

const OrderTracking = () => {
  const currentOrder = {
    id: "ORD-2024-003",
    date: "2024-11-02",
    time: "15:30",
    total: 4200000,
    status: "pending",
    currentStatus: "Đang chờ xử lý",
    estimatedDelivery: "05-06/11/2024",
    products: [
      {
        name: "Adidas NMD_R1",
        quantity: 1,
        price: 2800000,
        size: "42",
        color: "Đen",
      },
      {
        name: "Adidas Backpack",
        quantity: 1,
        price: 1400000,
        color: "Xám",
      },
    ],
    statusHistory: [
      {
        status: "Đang chờ xử lý",
        timestamp: "2024-11-02 15:30",
        description: "Đơn hàng đã được đặt thành công và đang chờ xác nhận",
        icon: "pending",
      },
    ],
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    },
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
  };

  const getStatusIcon = (iconType) => {
    switch (iconType) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "shipping":
        return <Truck className="w-6 h-6 text-blue-600" />;
      case "confirmed":
        return <Package className="w-6 h-6 text-purple-600" />;
      default:
        return <Clock className="w-6 h-6 text-orange-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
            <p className="text-lg font-semibold">{currentOrder.date}</p>
            <p className="text-sm text-gray-600">{currentOrder.time}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Dự kiến giao hàng</h3>
            </div>
            <p className="text-lg font-semibold">
              {currentOrder.estimatedDelivery}
            </p>
            <p className="text-sm text-gray-600">Giao hàng tiêu chuẩn</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-sm uppercase">Tổng tiền</h3>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(currentOrder.total)}
            </p>
            <p className="text-sm text-gray-600">
              {currentOrder.paymentMethod}
            </p>
          </div>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-6 uppercase">
            Trạng thái đơn hàng
          </h3>

          <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            {getStatusIcon("pending")}
            <div className="flex-1">
              <p className="font-bold text-lg">{currentOrder.currentStatus}</p>
              <p className="text-sm text-gray-600 mt-1">
                {currentOrder.statusHistory[0].description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Cập nhật lúc: {currentOrder.statusHistory[0].timestamp}
              </p>
            </div>
          </div>
        </div>

        {/* Lịch sử trạng thái */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-4 uppercase">
            Lịch sử trạng thái
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-sm">
                    TRẠNG THÁI
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-sm">
                    THỜI GIAN
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-sm hidden md:table-cell">
                    MÔ TẢ
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.statusHistory.map((history, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(history.icon)}
                        <span className="font-semibold">{history.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {history.timestamp}
                    </td>
                    <td className="py-4 px-4 text-gray-600 hidden md:table-cell">
                      {history.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-bold text-xl mb-4 uppercase">Sản phẩm</h3>
          <div className="space-y-4">
            {currentOrder.products.map((product, idx) => (
              <div
                key={idx}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-3xl flex-shrink-0">
                  👟
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
                {formatCurrency(currentOrder.total)}
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
                {currentOrder.shippingAddress.name}
              </p>
              <p>{currentOrder.shippingAddress.phone}</p>
              <p>{currentOrder.shippingAddress.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold uppercase">Phương thức thanh toán</h3>
            </div>
            <p className="text-gray-700">{currentOrder.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
