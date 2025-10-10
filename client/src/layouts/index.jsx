import UspHeader from "./USPHeader";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";

const Layouts = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
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
  );
};

export default Layouts;
