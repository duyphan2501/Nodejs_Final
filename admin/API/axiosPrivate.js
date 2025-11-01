// src/api/axiosPrivate.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ;

// Tạo axios instance
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng để gửi cookie
});

// Request interceptor - Thêm token vào header
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý token hết hạn
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        // Lưu token mới
        localStorage.setItem('accessToken', accessToken);

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại -> Đăng xuất
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;