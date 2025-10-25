import React, { createContext, useContext, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser({
        name: "ĐỨC ĐỖ",
        birthdate: "2005-10-13",
        gender: "Nam",
        email: "DUCXCOC@GMAIL.COM",
        hasPassword: true,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (field, value) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser((prevUser) => ({ ...prevUser, [field]: value }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logoutAllBrowsers = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Demo: Đăng xuất khỏi tất cả trình duyệt");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteAccount = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Demo: Tài khoản đã được xóa");
      setUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUserData,
        updateUser,
        logoutAllBrowsers,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export default UserProvider;
