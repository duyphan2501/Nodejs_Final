import { useContext, useEffect } from "react";
import axiosCustom from "../API/axiosInstance.js";
import useUserStore from "../stores/useUserStore.js";
import { MyContext } from "../src/context/MyContext.jsx";

const useAxiosPrivate = () => {
  const { refreshToken } = useUserStore();
  const { persist } = useContext(MyContext);

  useEffect(() => {
    const requestInterceptor = axiosCustom.interceptors.request.use(
      (config) => {
        const token = useUserStore.getState().accessToken;
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosCustom.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !prevRequest._retry &&
          persist
        ) {
          prevRequest._retry = true;
          try {
            const refreshed = await refreshToken();
            prevRequest.headers = {
              ...prevRequest.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            };
            return axiosCustom(prevRequest);
          } catch (err) {
            useUserStore.getState().logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosCustom.interceptors.request.eject(requestInterceptor);
      axiosCustom.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, persist]);

  return axiosCustom;
};

export default useAxiosPrivate;
