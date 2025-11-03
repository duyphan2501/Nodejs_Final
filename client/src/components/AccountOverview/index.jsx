import { ChevronRight } from "lucide-react";

export default function AccountOverview() {
  const menuItems = [
    { label: "Thông Tin Cá Nhân", hasArrow: true, link: "/my-account" },
    { label: "Sổ Địa Chỉ", hasArrow: true, link: "/addresses" },
    { label: "Đơn hàng", hasArrow: false, link: "/order" },
    { label: "Lịch sử đặt hàng", hasArrow: false, link: "/order-history" },
    { label: "Đăng xuất", hasArrow: false, link: "/logout" },
  ];

  const handleClick = (link) => {
    console.log("Navigating to:", link);
    window.location.href = link;
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">TỔNG QUAN TÀI KHOẢN</h1>
      </div>

      {/* Menu Items */}
      <div className="bg-white overflow-hidden shadow-sm divide-y divide-gray-200">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item.link)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-black hover:text-white transition-colors text-left group"
          >
            <span className="text-gray-900 group-hover:text-white">
              {item.label}
            </span>
            {item.hasArrow && (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
