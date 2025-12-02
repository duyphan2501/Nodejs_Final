import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Truck, RotateCcw } from "lucide-react";

// Mock API data
const mockApiData = {
  headerTexts: [
    "MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC",
    "ĐỔI TRẢ TRONG 15 NGÀY",
    "ƯU ĐÃI ĐỘC QUYỀN CHO THÀNH VIÊN",
  ],

  panels: [
    {
      id: 1,
      icon: Truck,
      title: "VẬN CHUYỂN MIỄN PHÍ CHO THÀNH VIÊN",
      description:
        "Đăng ký tài khoản thành viên để nhận ưu đãi giao hàng miễn phí trên mọi đơn hàng. Hoặc miễn phí vận chuyển với đơn từ 1.000.000đ.",
      buttonText: "ĐĂNG KÝ NGAY",
      buttonStyle: "primary",
      buttonLink: "/sign-up",
    },
    {
      id: 2,
      icon: RotateCcw,
      title: "CHÍNH SÁCH ĐỔI TRẢ NHANH CHÓNG",
      description:
        "Nếu sản phẩm không phù hợp, bạn có thể yêu cầu đổi hoặc trả hàng dễ dàng trong vòng 15 ngày kể từ khi nhận hàng. Xem thêm chi tiết tại trang chính sách.",
      buttonText: "XEM CHI TIẾT",
      buttonStyle: "secondary",
      buttonLink: "#",
    },
  ],
};


const fetchUspData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockApiData), 500);
  });
};

const UspHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uspData, setUspData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTitle, setCurrentTitle] = useState(0);

  useEffect(() => {
    if (!uspData?.headerTexts) return;

    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % uspData.headerTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [uspData?.headerTexts?.length]);

  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      try {
        const data = await fetchUspData();
        setUspData(data);
      } catch (error) {
        console.error("Failed to load USP data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  if (loading || !uspData) {
    return (
      <div className="bg-black text-white py-3 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      {/* Header Bar */}
      <div
        className={`bg-black text-white py-3 cursor-pointer select-none hover:bg-gray-800 transition-colors
          `}
        onClick={togglePanel}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="relative h-6 flex items-center justify-center whitespace-nowrap gap-4">
              {uspData.headerTexts.map((text, index) => (
                <div
                  key={index}
                  className={`absolute flex items-center gap-2 transition-all duration-700 ease-in-out
              ${
                index === currentTitle
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
                >
                  <span className="font-semibold text-sm md:text-base tracking-wide">
                    {text}
                  </span>

                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={togglePanel}
        ></div>
      )}

      {/* Dropdown Panel */}
      <div
        className={`fixed left-0 right-0 bg-white border-b border-gray-200 shadow-lg
              transition-all duration-300 ease-in-out z-50
              ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }
              `}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={togglePanel}
              className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {uspData.panels.map((panel) => {
              const IconComponent = panel.icon;
              return (
                <div
                  key={panel.id}
                  className="bg-white p-6 rounded-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Title */}
                  <h3 className="font-bold text-lg md:text-xl mb-3 leading-tight">
                    {panel.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed flex-grow">
                    {panel.description}
                  </p>
                  {/* Button */}
                  <a
                    href={panel.buttonLink}
                    className="bg-transparent border-none shadow-none text-black underline hover:bg-black hover:text-white hover:underline 
             transition-colors duration-200 self-start"
                  >
                    {panel.buttonText}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UspHeader;
