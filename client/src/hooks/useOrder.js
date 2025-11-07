import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useOrder = () => {
  const axiosPrivate = useAxiosPrivate();

  // Lấy tất cả đơn hàng
  const getAllOrders = async () => {
    try {
      const response = await axiosPrivate.get("api/order");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy đơn hàng đang xử lý
  const getActiveOrders = async () => {
    try {
      const response = await axiosPrivate.get("api/order/active");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy đơn hàng theo ID
  const getOrderById = async (orderId) => {
    try {
      const response = await axiosPrivate.get(`api/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lọc đơn hàng theo trạng thái
  const getOrdersByStatus = async (status) => {
    try {
      const response = await axiosPrivate.get(`api/order/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy thống kê đơn hàng
  const getOrderStats = async () => {
    try {
      const response = await axiosPrivate.get("api/order/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // FAKE API - Test chuyển trạng thái
  const fakeDeliveryUpdate = async (orderId) => {
    try {
      const response = await axiosPrivate.post(
        `api/order/fake-delivery/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  return {
    getAllOrders,
    getActiveOrders,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    fakeDeliveryUpdate,
  };
};

// Hook để tự động cập nhật trạng thái đơn hàng mỗi 1 phút
export const useAutoUpdateOrder = (orderId, onUpdate) => {
  const { fakeDeliveryUpdate } = useOrder();
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!orderId || !isRunning) return;

    const interval = setInterval(async () => {
      try {
        const result = await fakeDeliveryUpdate(orderId);
        if (onUpdate) {
          onUpdate(result.data);
        }
        // Dừng nếu đã giao hàng
        if (result.data.status === "delivered") {
          setIsRunning(false);
        }
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }, 60000); // 1 phút = 60000ms

    return () => clearInterval(interval);
  }, [orderId, isRunning, fakeDeliveryUpdate, onUpdate]);

  return { isRunning, setIsRunning };
};

export default useOrder;
