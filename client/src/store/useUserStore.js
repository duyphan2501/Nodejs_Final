import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const useUserStore = create((set) => {
  const login = async (user) => {
    try {
      const res = await axios.post(`${API_URL}/user/login`, user);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Failed to login");
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/user/refresh-token`);
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
  }

  return {
    user: null,
    accessToken: null,
    login,
    refreshToken
  };
});

export default useUserStore;
