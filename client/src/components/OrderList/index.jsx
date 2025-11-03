import React, { useState } from "react";
import { Package, Truck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Component 1: OrderList - Danh sách đơn hàng đang xử lý
const OrderList = ({ onSelectOrder, onNavigateToHistory }) => {
  const orders = [
    {
      id: "ORD-2024-002",
      link: "order/ORD-2024-002",
      date: "2024-10-30",
      time: "14:20",
      total: 1950000,
      status: "shipping",
      currentStatus: "Đang vận chuyển",
      deliveryDate: null,
      estimatedDelivery: "2024-11-03",
      products: [
        {
          name: "Adidas Stan Smith",
          quantity: 1,
          price: 1950000,
          color: "Xanh lá",
          size: "41",
        },
      ],
      statusHistory: [
        {
          status: "Đang vận chuyển",
          timestamp: "2024-11-01 09:00",
          description: "Đơn hàng đang trên đường giao đến bạn",
          icon: "shipping",
        },
        {
          status: "Đã xác nhận",
          timestamp: "2024-10-31 11:30",
          description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
          icon: "confirmed",
        },
        {
          status: "Đang chờ xử lý",
          timestamp: "2024-10-30 14:20",
          description: "Đơn hàng đã được đặt thành công",
          icon: "pending",
        },
      ],
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0123456789",
        address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
      },
      paymentMethod: "Thanh toán khi nhận hàng (COD)",
    },
    {
      id: "ORD-2024-003",
      link: "order/ORD-2024-002",
      date: "2024-11-02",
      time: "15:30",
      total: 4200000,
      status: "pending",
      currentStatus: "Đang chờ xử lý",
      deliveryDate: null,
      estimatedDelivery: "05-06/11/2024",
      products: [
        {
          name: "Adidas NMD_R1",
          quantity: 1,
          price: 2800000,
          color: "Đen",
          size: "42",
        },
        { name: "Adidas Backpack", quantity: 1, price: 1400000, color: "Xám" },
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
    },
    {
      id: "ORD-2024-004",
      link: "order/ORD-2024-002",
      date: "2024-11-01",
      time: "17:30",
      total: 5100000,
      status: "confirmed",
      currentStatus: "Đã xác nhận",
      deliveryDate: null,
      estimatedDelivery: "2024-11-05",
      products: [
        {
          name: "Adidas Yeezy Boost 350",
          quantity: 1,
          price: 4500000,
          color: "Be",
          size: "43",
        },
        {
          name: "Adidas Socks (3 đôi)",
          quantity: 1,
          price: 600000,
          color: "Trắng",
        },
      ],
      statusHistory: [
        {
          status: "Đã xác nhận",
          timestamp: "2024-11-02 08:45",
          description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
          icon: "confirmed",
        },
        {
          status: "Đang chờ xử lý",
          timestamp: "2024-11-01 17:30",
          description: "Đơn hàng đã được đặt thành công",
          icon: "pending",
        },
      ],
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0123456789",
        address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
      },
      paymentMethod: "Chuyển khoản ngân hàng",
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipping":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "confirmed":
        return <Package className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Đơn hàng đang xử lý
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-50 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang vận chuyển</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter((o) => o.status === "confirmed").length}
            </p>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "shipping").length}
            </p>
            <p className="text-sm text-gray-600">Đang vận chuyển</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-600">
                Không có đơn hàng nào
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-black"
                onClick={() => onSelectOrder(order)}
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <h3 className="font-bold text-xl">{order.id}</h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.currentStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          Ngày đặt:{" "}
                          <span className="font-semibold">
                            {order.date} {order.time}
                          </span>
                        </p>
                        <p>
                          Dự kiến giao:{" "}
                          <span className="font-semibold">
                            {order.estimatedDelivery}
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        {order.products.map((product, idx) => (
                          <p key={idx} className="text-sm text-gray-700">
                            • {product.name}{" "}
                            <span className="text-gray-500">
                              (x{product.quantity})
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-left md:text-right flex md:flex-col justify-between md:justify-start items-center md:items-end gap-2">
                      <div>
                        <p className="text-sm text-gray-600 uppercase">
                          Tổng tiền
                        </p>
                        <p className="font-bold text-2xl">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.products.length} sản phẩm
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/${order.link}`);
                        }}
                        className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                      >
                        THEO DÕI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
