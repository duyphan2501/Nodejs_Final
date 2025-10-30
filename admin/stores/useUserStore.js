import { create } from "zustand";
import { toast } from "react-toastify";
import axiosCustom from "../API/axiosInstance";

const useUserStore = create((set, get) => {
  const setUser = (user, accessToken = null) => {
    set({
      user,
      accessToken,
    });
  };

  const login = async (user) => {
    try {
      const res = await axiosCustom.post(`/user/login`, user);
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
      toast.error(error.response.data.message || "Đăng nhập thất bại");
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axiosCustom.put(`/user/refresh-token`);
      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });
      return { accessToken: res.data.accessToken };
    } catch (error) {
      set({
        message:
          error.response.data.message ||
          "Token đã hết hạn. Vui lòng đăng nhập lại!",
      });
      throw error;
    }
  };

  const logout = async () => {
    const res = await axiosCustom.delete("/user/logout", {
      user: get().user,
    });
  };

  return {
    user: null,
    accessToken: null,
    login,
    refreshToken,
    setUser,
    logout,
  };
});

export default useUserStore;
