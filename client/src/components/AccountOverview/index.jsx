import { ChevronRight } from "lucide-react";

export default function AccountOverview() {
  const menuItems = [
    { label: "Thông Tin Cá Nhân", hasArrow: true, link: "/my-account" },
    { label: "Sổ Địa Chỉ", hasArrow: true, link: "/addresses" },
    { label: "Đơn hàng", hasArrow: true, link: "/order" },
    { label: "Lịch sử đặt hàng", hasArrow: true, link: "/order-history" },
  ];

  const handleClick = (link) => {
    window.location.href = link;
  };

  return (
    <div className=" lg:w-[380px] bg-gray-50">
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
