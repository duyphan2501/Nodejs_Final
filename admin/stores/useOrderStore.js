import { create } from "zustand";
import axiosPrivate from "../API/axiosPrivate";
import { toast } from "react-toastify";

const useOrderStore = create((set, get) => ({
  orders: [],
  originalOrders: [],
  orderDetail: {},
  orderDetailList: [],
  dashboard: {},

  getOrders: async () => {
    try {
      const res = await axiosPrivate.get("/api/order/all/");

      set(() => ({
        orders: res.data.result,
        originalOrders: res.data.result,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách sản phẩm");
    }
  },

  getOrderById: async (_id) => {
    try {
      const res = await axiosPrivate.get(`/api/order/all/${_id}`);

      set(() => ({
        orderDetail: res.data.result,
        orderDetailList: res.data.result.items,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu thất bại");
    }
  },

  updateOrderStatus: async (_id, status) => {
    try {
      const res = await axiosPrivate.put(`/api/order/all/${_id}`, {
        status,
      });

      if (res.data?.success) {
        await get().getOrders();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Có lỗi xảy ra");
    }
  },

  setOrders: (orders) => {
    set(() => ({
      orders,
    }));
  },

  setOrderDetailList: (orderDetailList) => {
    set(() => ({
      orderDetailList,
    }));
  },

  setOrderDetail: (orderDetail) => {
    set(() => ({
      orderDetail,
    }));
  },

  getDashboardData: async (
    startDate = "2025-01-01",
    endDate = "2025-12-31"
  ) => {
    try {
      const res = await axiosPrivate.post("/api/order/dashboard", {
        startDate,
        endDate,
      });

      if (res.data.success) {
        set(() => ({
          dashboard: {
            growthDataMonth: res.data.growthDataMonth,
            growthDataDaily: res.data.growthDataDaily,
            revenueChartData: res.data.revenueChartData,
          },
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Không tải được dữ liệu");
    }
  },
}));

export default useOrderStore;
