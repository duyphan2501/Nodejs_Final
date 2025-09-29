import React, { useState, useEffect, useRef } from "react";

const AccountMenu = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("for-you");
  const menuRef = useRef(null);

  // Static data - no API needed
  const userSections = [
    { id: "orders", title: "ĐƠN HÀNG CỦA TÔI" },
    { id: "rewards", title: "PHẦN THƯỞNG CỦA TÔI" },
    { id: "history", title: "LỊCH SỬ ĐIỂM" },
  ];

  const tabs = [
    { id: "for-you", title: "CHỈ DÀNH CHO BẠN" },
    { id: "use-points", title: "DÙNG ĐIỂM" },
    { id: "earn-points", title: "TÍCH ĐIỂM" },
  ];

  const promotions = [
    {
      id: 1,
      title: "Tải xuống ứng dụng adidas",
      description:
        "Nhận thông báo về các bản phát hành, khuyến mãi và ưu đãi cho hội viên",
    },
    {
      id: 2,
      title: "Chạy bộ và tích điểm",
      description:
        "Tải ứng dụng adidas Running và nhận 2 điểm cho mỗi km theo dõi được",
    },
    {
      id: 3,
      title: "Chỉ có tại adiClub",
      description: "Các sản phẩm độc quyền dành cho hội viên",
    },
  ];

  const benefits = [
    "Miễn phí vận chuyển",
    "Điểm adiClub theo đơn hàng của bạn",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleMenuItemClick = (item) => {
    console.log("Menu item clicked:", item);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

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
          <button className="p-2 hover:bg-gray-100 rounded">
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
          <button className="p-2 hover:bg-gray-100 rounded">
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
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
          {userSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleMenuItemClick(section)}
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
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wide border-b-2 transition-colors text-center ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Promotions */}
        <div className="p-4 space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="border border-gray-200 rounded p-4 hover:shadow-sm transition-shadow cursor-pointer bg-white"
              onClick={() => handleMenuItemClick(promo)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-3">
                  <h3 className="font-medium text-base mb-2 text-black">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {promo.description}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
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
              </div>
            </div>
          ))}

          {/* Benefits */}
          <div className="mt-8">
            <h3 className="font-medium text-base mb-4 text-black">
              Các lợi ích của bạn
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-black flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-black">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
