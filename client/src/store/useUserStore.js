import { create } from "zustand";
import { toast } from "react-toastify";
import API from "../API/axiosInstance";

const useUserStore = create((set) => {
  const login = async (user) => {
    set({ isLoading: { login: true } });
    try {
      const res = await API.post(`/api/user/login`, user);
      set({ user: res.data.user, accessToken: res.data.accessToken});
      toast.success(res.data.message);
      return { success: true, loginUser: res.data.user };
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || message;
        if (error.response.status === 401 && error.response.data.notVerified) {
          const user = error.response.data?.user;
          toast.info(message || "Please verify your account");
          return { success: false, loginUser: user };
        } else {
          toast.error(message || "Failed to sign up");
        }
      }
      return { success: false, loginUser: null};
    } finally {
      set({ isLoading: { login: false } });
    }
  };

  const refreshToken = async () => {
    set({ isLoading: { refresh: true } });
    try {
      const res = await API.put(`/api/user/refresh-token`);
      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });
      return { accessToken: res.data.accessToken };
    } catch (error) {
      throw error;
    }
    finally {
      set({ isLoading: { refresh: false } });
    }
  };

  const signUp = async (user) => {
    set({ isLoading: { signUp: true } });
    try {
      const res = await API.post(`/api/user/sign-up`, user);
      toast.success(res.data.message);
      set({ user: res.data.user });
      return {verifyUser: res.data.user, success: true};
    } catch (error) {
      console.log(error);
      if (error.response) {
        const message = error.response.data?.message || message;
        if (error.response.status === 401) {
          const user = error.response.data?.user;
          toast.info(message || "Please verify your account");
          return {verifyUser: user, success: false};
        } else {
          toast.error(message || "Failed to sign up");
        }
      }
      return {verifyUser: null, success: false};
    } finally {
      set({ isLoading: { signUp: false } });
    }
  };

  const verifyAccount = async (formData) => {
    set({ isLoading: { verify: true } });
    try {
      const res = await API.put(`/api/user/verify-account`, formData);
      toast.success(res.data.message);
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to verify account");
      return false;
    } finally {
      set({ isLoading: { verify: false } });
    }
  };

  const sendVerificationEmail = async (email) => {
    set({ isLoading: { resend: true } });
    try {
      const res = await API.put(`/api/user/resend-verification-email`, { email });
      toast.success(res.data.message);
      return true;
    } catch (error) { 
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to resend verification email");
      return false;
    } finally {
      set({ isLoading: { resend: false } });
    }
  };

  const sendForgotPasswordEmail = async (email) => {
    set({ isLoading: { forgot: true } });
    try {
      const res = await API.post(`/api/user/forgot-password`, { email });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send forgot password email");
      return false;
    } finally {
      set({ isLoading: { forgot: false } });
    } 
  };

  const resetPassword = async (token, password, confirmPassword) => {
    set({ isLoading: { reset: true } });
    try {
      const res = await API.put(`/api/user/reset-password`, { token, password, confirmPassword });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      return false;
    } finally {
      set({ isLoading: { reset: false } });
    } 
  };

  const logout = async () => {
    try {
      const res = await API.delete(`/api/user/logout`);
      toast.info(res.data.message);
      set({user: null, accessToken: null})
      return true;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to logout");
      return false;
    } 
  };

  return {
    user: null,
    accessToken: null,
    isLoading: {login: false, refresh: false, signUp: false, verify: false, resend: false, forgot: false, reset: false},
    login,
    refreshToken,
    signUp,
    verifyAccount,
    sendVerificationEmail,
    sendForgotPasswordEmail,
    resetPassword,
    logout,
  };
});

export default useUserStore;
