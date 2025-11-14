import { create } from "zustand";
import API from "../API/axiosInstance";
import { toast } from "react-toastify";

const useEvaluationStore = create((set) => ({
  evaluations: [],
  averageStar: 0,
  setEvaluations: (updater) =>
    set((state) => ({
      evaluations:
        typeof updater === "function" ? updater(state.evaluations) : updater,
    })),

  setAverageStar: (averageStar) => set({ averageStar }),

  getEvaluationsByProductId: async (productId) => {
    try {
      const res = await API.get(`/api/evaluation/product/${productId}`);
      set({
        evaluations: res.data.evaluations,
        averageStar: Number(res.data.averageStar),
      });
      return res.data.evaluations;
    } catch (error) {
      console.error(error.response?.data?.message || "Get evaluations error");
      toast.error(error.response?.data?.message || "Không tải được đánh giá");
    }
  },
}));

export default useEvaluationStore;
