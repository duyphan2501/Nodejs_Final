import axios from "axios";
import useUserStore from "../stores/useUserStore.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// 🧩 Tạo instance axiosPrivate
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Gửi cookie nếu có
});

// 🧠 Thêm interceptor request
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Thêm interceptor response để refresh token
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    const { refreshToken, logout } = useUserStore.getState();

    // 🧩 Lấy persist từ localStorage (giá trị "true"/"false")
    const persist = localStorage.getItem("persist") === "true";

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !prevRequest._retry &&
      persist
    ) {
      prevRequest._retry = true;

      try {
        const refreshed = await refreshToken();
        prevRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return axiosPrivate(prevRequest); // Retry request ban đầu
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;
