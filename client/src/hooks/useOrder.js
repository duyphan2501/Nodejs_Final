import { useEffect, useRef } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useOrderAPI = () => {
  const axiosPrivate = useAxiosPrivate(); // ✅ gọi hook đúng cách

  // Lấy tất cả đơn hàng
  const getAllOrders = async () => {
    try {
      const response = await axiosPrivate.get("/api/order");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy đơn hàng đang xử lý
  const getActiveOrders = async () => {
    try {
      const response = await axiosPrivate.get("/api/order/active");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy chi tiết đơn hàng
  const getOrderById = async (orderId) => {
    try {
      const response = await axiosPrivate.get(`/api/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lọc đơn hàng theo trạng thái
  const getOrdersByStatus = async (status) => {
    try {
      const response = await axiosPrivate.get(`/api/order/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Lấy thống kê đơn hàng
  const getOrderStats = async () => {
    try {
      const response = await axiosPrivate.get("/api/order/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Hủy đơn hàng
  const cancelOrder = async (orderId) => {
    try {
      const response = await axiosPrivate.post(`/api/order/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // FAKE API - Test chuyển trạng thái tự động
  const fakeDeliveryUpdate = async (orderId) => {
    try {
      const response = await axiosPrivate.post(
        `/api/order/fake-delivery/${orderId}`
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
    cancelOrder,
    fakeDeliveryUpdate,
  };
};

// Custom hook tự động cập nhật trạng thái đơn hàng
export const useAutoUpdateOrder = (orderId, onUpdate) => {
  const intervalRef = useRef(null);
  const { getOrderById } = useOrderAPI();

  useEffect(() => {
    if (!orderId) return;

    const fetchAndUpdate = async () => {
      try {
        const result = await getOrderById(orderId);
        if (result?.data && onUpdate) {
          onUpdate(result.data);
        }
      } catch (error) {
        console.error("Error auto-updating order:", error);
      }
    };

    // Cập nhật mỗi 60 giây (1 phút)
    intervalRef.current = setInterval(fetchAndUpdate, 60000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId, onUpdate]);

  return {
    isRunning: !!intervalRef.current,
  };
};

export default useOrderAPI;
