import { create } from "zustand";
import { toast } from "react-toastify";
import axiosCustom from "../API/axiosInstance";

const useUserStore = create((set) => {
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
      toast.error(error.response.data.message || "Failed to login");
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
        message:
          error.response.data.message ||
          "Token is expired, you have login again!",
      });
      throw error;
    }
  };

  return {
    user: null,
    accessToken: null,
    login,
    refreshToken,
  };
});

export default useUserStore;
