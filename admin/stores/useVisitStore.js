import { create } from "zustand";
import axiosPrivate from "../API/axiosPrivate";
import { toast } from "react-toastify";

const useVisitStore = create((set) => ({
  visits: [],
  totalVisits: 0,
  loading: false,

  getVisits: async () => {
    try {
      set({ loading: true });
      const res = await axiosPrivate.get("/api/visit/");

      if (res.status === 200) {
        const data = res.data;

        set({
          visits: data,
          totalVisits: data.reduce((sum, v) => sum + v.visits, 0),
          loading: false,
        });
      } else {
        set({ loading: false });
        toast.error("Không thể tải dữ liệu lượt truy cập");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu lượt truy cập");
      set({ loading: false });
    }
  },

  // 🧩 Đặt lại danh sách visit thủ công (nếu cần)
  setVisits: (visits) => {
    set({
      visits,
      totalVisits: visits.reduce((sum, v) => sum + v.visits, 0),
    });
  },
}));

export default useVisitStore;
