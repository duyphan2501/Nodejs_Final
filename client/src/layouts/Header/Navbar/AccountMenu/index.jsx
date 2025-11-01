import React, { useState, useEffect, useRef } from "react";
import useUserStore from "../../../../store/useUserStore";
import { FaRegSmileWink } from "react-icons/fa";
import { Button } from "@mui/material";
import { IoMdLogOut } from "react-icons/io";
import MyTooltip from "../../../../components/MyTooltip";
import useCartStore from "../../../../store/useCartStore";

const AccountMenu = ({ onClose }) => {
  const menuRef = useRef(null);
  const user = useUserStore((state) => state.user);
  const { logout } = useUserStore();
  const { clearCartItems } = useCartStore();
  // Static data - no API needed
  const userSections = [
    { id: "information", title: "THÔNG TIN CÁ NHÂN", href: "/my-account" },
    { id: "orders", title: "ĐƠN HÀNG CỦA TÔI", href: "/my-orders" },
    { id: "rewards", title: "SỔ ĐỊA CHỈ", href: "/addresses" },
  ];

  const handleLogout = async () => {
    await logout();
    clearCartItems();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed top-0 right-0 bottom-0 h-screen w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold tracking-tight">adiclub</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* User icon */}
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          {/* Info icon */}
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content - hidden scrollbar */}
      <div
        className="max-h-[92vh] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* User Sections */}
        <div className="bg-gray-50">
          <div className="flex items-center py-2 px-5">
            {/*  */}
            <div className=" flex-1">
              <div className=" flex items-center gap-2 ">
                <FaRegSmileWink size={30} />
                <div className="">
                  <div className="font-bold ">{user?.name || "Duy Phan"}</div>
                  <div className="text-sm ">
                    {user?.email || "duyneon09@gmail.com"}
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div
              className="cursor-pointer hover:text-gray-600"
              onClick={handleLogout}
            >
              <MyTooltip label={"Đăng xuất"} position="left">
                <IoMdLogOut size={25} />
              </MyTooltip>
            </div>
          </div>
          {userSections.map((section) => (
            <a
              key={section.id}
              href={section.href}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
            >
              <span className="font-medium text-sm tracking-wide uppercase text-left">
                {section.title}
              </span>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
