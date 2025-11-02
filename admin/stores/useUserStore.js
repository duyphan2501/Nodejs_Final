import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import axiosCustom from "../API/axiosInstance";

const useUserStore = create(
  persist(
    (set, get) => {
      const setUser = (user, accessToken = null) => {
        set({
          user,
          accessToken,
        });
      };

      const login = async (user) => {
        try {
          const res = await axiosCustom.post(`/api/user/login`, user);
          toast.success(res.data.message);
          if (res.data.user.isAdmin) {
            set({
              user: res.data.user,
              accessToken: res.data.accessToken,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.response?.data?.message || "Đăng nhập thất bại");
        }
      };

      const refreshToken = async () => {
        try {
          const res = await axiosCustom.put(`/api/user/refresh-token`);
          set({
            user: res.data.user,
            accessToken: res.data.accessToken,
          });
          return { accessToken: res.data.accessToken };
        } catch (error) {
          set({
            user: null,
            accessToken: null,
          });
          toast.error(
            error.response?.data?.message ||
              "Token đã hết hạn. Vui lòng đăng nhập lại!"
          );
          throw error;
        }
      };

      const logout = async () => {
        try {
          await axiosCustom.delete("/api/user/logout", {
            data: { user: get().user },
          });
        } catch (error) {
          console.log(error);
        } finally {
          set({ user: null, accessToken: null });
          localStorage.removeItem("user-storage");
        }
      };

      return {
        user: null,
        accessToken: null,
        login,
        refreshToken,
        setUser,
        logout,
      };
    },
    {
      name: "user-storage", // 👈 tên key lưu trong localStorage
      partialize: (state) => ({
        user: state.user,
      }), // chỉ lưu 2 trường cần thiết
    }
  )
);

export default useUserStore;
