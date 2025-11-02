import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const OrderHistory = () => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");

  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-10-28",
      total: 3450000,
      status: "delivered",
      currentStatus: "Đã giao",
      deliveryDate: "2024-10-31",
      products: [
        {
          name: "Adidas Ultraboost 22",
          quantity: 1,
          price: 2850000,
          color: "Trắng",
          size: "42",
        },
        {
          name: "Adidas Tee",
          quantity: 2,
          price: 600000,
          color: "Đen",
          size: "M",
        },
      ],
      statusHistory: [
        {
          status: "Đã giao",
          timestamp: "2024-10-31 14:30",
          description: "Đơn hàng đã được giao thành công",
          icon: "delivered",
        },
        {
          status: "Đang vận chuyển",
          timestamp: "2024-10-30 08:15",
          description: "Đơn hàng đang trên đường giao đến bạn",
          icon: "shipping",
        },
        {
          status: "Đã xác nhận",
          timestamp: "2024-10-29 10:20",
          description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
          icon: "confirmed",
        },
        {
          status: "Đang chờ xử lý",
          timestamp: "2024-10-28 16:45",
          description: "Đơn hàng đã được đặt thành công",
          icon: "pending",
        },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-10-30",
      total: 1950000,
      status: "shipping",
      currentStatus: "Đang vận chuyển",
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
    },
    {
      id: "ORD-2024-003",
      date: "2024-11-01",
      total: 4200000,
      status: "confirmed",
      currentStatus: "Đã xác nhận",
      estimatedDelivery: "2024-11-05",
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
    },
    {
      id: "ORD-2024-004",
      date: "2024-11-02",
      total: 2100000,
      status: "pending",
      currentStatus: "Đang chờ xử lý",
      estimatedDelivery: "2024-11-06",
      products: [
        {
          name: "Adidas Superstar",
          quantity: 1,
          price: 2100000,
          color: "Trắng/Đen",
          size: "40",
        },
      ],
      statusHistory: [
        {
          status: "Đang chờ xử lý",
          timestamp: "2024-11-02 10:15",
          description: "Đơn hàng đã được đặt thành công",
          icon: "pending",
        },
      ],
    },
  ];

  const getStatusIcon = (iconType) => {
    switch (iconType) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipping":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "confirmed":
        return <Package className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Title & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">LỊCH SỬ ĐƠN HÀNG</h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded font-semibold bg-white hover:bg-gray-50 cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang vận chuyển</option>
              <option value="delivered">Đã giao</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "shipping").length}
            </p>
            <p className="text-sm text-gray-600">Đang vận chuyển</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
            <p className="text-sm text-gray-600">Đã giao</p>
          </div>
        </div>

        {/* Orders List */}
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
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 md:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl">{order.id}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.currentStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <p>
                          Ngày đặt:{" "}
                          <span className="font-semibold">{order.date}</span>
                        </p>
                        {order.deliveryDate && (
                          <p>
                            Đã giao:{" "}
                            <span className="font-semibold">
                              {order.deliveryDate}
                            </span>
                          </p>
                        )}
                        {order.estimatedDelivery && !order.deliveryDate && (
                          <p>
                            Dự kiến giao:{" "}
                            <span className="font-semibold">
                              {order.estimatedDelivery}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-600 uppercase">
                          Tổng tiền
                        </p>
                        <p className="font-bold text-xl">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.products.length} sản phẩm
                        </p>
                      </div>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label={
                          expandedOrders[order.id] ? "Thu gọn" : "Mở rộng"
                        }
                      >
                        {expandedOrders[order.id] ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedOrders[order.id] && (
                    <div className="border-t pt-6 mt-4 space-y-6">
                      {/* Products */}
                      <div>
                        <h4 className="font-bold mb-4 uppercase text-sm">
                          Sản phẩm
                        </h4>
                        <div className="space-y-3">
                          {order.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex gap-4 items-start py-3 border-b last:border-b-0"
                            >
                              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                                👟
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold mb-1">
                                  {product.name}
                                </p>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    Màu: {product.color}{" "}
                                    {product.size && `| Size: ${product.size}`}
                                  </p>
                                  <p>Số lượng: {product.quantity}</p>
                                </div>
                              </div>
                              <p className="font-bold">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status History */}
                      <div>
                        <h4 className="font-bold mb-4 uppercase text-sm">
                          Lịch sử trạng thái
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-2 font-bold text-xs uppercase">
                                  Trạng thái
                                </th>
                                <th className="text-left py-3 px-2 font-bold text-xs uppercase">
                                  Thời gian
                                </th>
                                <th className="text-left py-3 px-2 font-bold text-xs uppercase hidden md:table-cell">
                                  Mô tả
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.statusHistory.map((history, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(history.icon)}
                                      <span className="font-medium text-sm">
                                        {history.status}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-gray-600 text-sm">
                                    {history.timestamp}
                                  </td>
                                  <td className="py-3 px-2 text-gray-600 text-sm hidden md:table-cell">
                                    {history.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button className="flex-1 bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 transition-colors uppercase text-sm">
                          Mua lại
                        </button>
                        <button className="flex-1 bg-white text-black border-2 border-black px-6 py-3 rounded font-bold hover:bg-gray-100 transition-colors uppercase text-sm">
                          Liên hệ hỗ trợ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
