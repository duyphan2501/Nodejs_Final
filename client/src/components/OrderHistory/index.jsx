import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  XCircle,
} from "lucide-react";
import useOrderAPI from "../../hooks/useOrder";

const OrderHistory = () => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const { getAllOrders, getOrdersByStatus, getOrderStats, cancelOrder } =
    useOrderAPI();

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      let result;
      if (selectedStatus === "all") {
        result = await getAllOrders();
      } else {
        result = await getOrdersByStatus(selectedStatus);
      }
      setOrders(result.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải đơn hàng");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getOrderStats();
      setStats(result.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      await cancelOrder(orderId);
      await fetchOrders();
      await fetchStats();
      alert("Đơn hàng đã được hủy thành công");
    } catch (err) {
      alert(err.message || "Không thể hủy đơn hàng");
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipping":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "confirmed":
        return <Package className="w-5 h-5 text-purple-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
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
      case "cancelled":
        return "bg-red-100 text-red-800";
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

  const canCancelOrder = (status) => {
    return ["pending", "confirmed"].includes(status);
  };

  if (loading && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

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
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600">Chờ xử lý</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.shipping}
              </p>
              <p className="text-sm text-gray-600">Đang vận chuyển</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
              <p className="text-sm text-gray-600">Đã giao</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-sm text-gray-600">Đã hủy</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-600">
                Không có đơn hàng nào
              </p>
            </div>
          ) : (
            orders.map((order) => (
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
                        {order.cancelledDate && (
                          <p>
                            Đã hủy:{" "}
                            <span className="font-semibold">
                              {order.cancelledDate}
                            </span>
                          </p>
                        )}
                        {order.estimatedDelivery &&
                          !order.deliveryDate &&
                          !order.cancelledDate && (
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
                          {order?.products.length > 0 &&
                            order.products.map((product, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-start py-3 border-b last:border-b-0"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <span className="text-2xl">👟</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold mb-1">
                                    {product.name}
                                  </p>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                      Màu: {product.color}{" "}
                                      {product.size &&
                                        `| Size: ${product.size}`}
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

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder === order.id}
                            className="flex-1 bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition-colors uppercase text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {cancellingOrder === order.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang hủy...
                              </>
                            ) : (
                              "Hủy đơn hàng"
                            )}
                          </button>
                        )}
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
