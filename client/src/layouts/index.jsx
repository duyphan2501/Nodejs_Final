import UspHeader from "./USPHeader";
import Header from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import useUserStore from "../store/useUserStore";
import { MyContext } from "../Context/MyContext";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Layouts = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { refreshToken } = useUserStore();
  const { persist } = useContext(MyContext);
  const navigator = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      setIsLoading(true);
      try {
        if (user || !persist) return;
        await refreshToken();
      } catch (error) {
        if (isMounted) {
          if (
            location.pathname === "/addresses" ||
            location.pathname === "/my-account"
          ) {
            toast.info("Bạn cần phải đăng nhập trước!");
            navigator("/login");
          }
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    refresh();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="fixed inset-0 z-50  opacity-30"></div>
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
            <AiOutlineLoading3Quarters
              className="animate-spin text-white"
              size={100}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col min-h-screen">
          <div
            className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out 
            ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
          >
            <UspHeader />
            <Header />
          </div>

          <main className="flex-grow">
            <Outlet />
          </main>

          <Footer />
        </div>
      )}
    </>
  );
};

export default Layouts;
