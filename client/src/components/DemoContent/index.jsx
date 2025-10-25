import React, { useState } from "react";
import { Menu, ChevronRight, X } from "lucide-react";

// Component 3: Login Details & Account Management
const LoginDetailsSection = () => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-6">CHI TIẾT ĐĂNG NHẬP</h3>

      <div className="space-y-6">
        <div>
          <p className="text-gray-600 text-sm mb-1">EMAIL</p>
          <p className="text-base mb-2">DUCKCOC@GMAIL.COM</p>
          <button className="text-sm font-semibold underline hover:no-underline">
            CHỈNH SỬA
          </button>
        </div>

        <div>
          <p className="text-gray-600 text-sm mb-1">MẬT KHẨU</p>
          <p className="text-base mb-2">************</p>
          <button className="text-sm font-semibold underline hover:no-underline">
            CHỈNH SỬA
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-bold mb-4">
          ĐĂNG XUẤT KHỎI TẤT CẢ TRÌNH DUYỆT WEB
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Thao tác này sẽ giúp bạn đăng xuất khỏi tất cả các trình duyệt web mà
          bạn đã sử dụng để truy cập vào trang web của adidas. Để đăng nhập lại,
          bạn sẽ phải nhập thông tin đăng nhập của mình.
        </p>
        <button className="w-full py-3 px-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors mb-4 flex items-center justify-center">
          ĐĂNG XUẤT <span className="ml-2">→</span>
        </button>

        <h3 className="text-lg font-bold mb-4 mt-6">QUẢN LÝ TÀI KHOẢN</h3>
        <button className="w-full py-3 px-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors flex items-center justify-center">
          XÓA TÀI KHOẢN <span className="ml-2">→</span>
        </button>
        <p className="text-gray-600 text-xs mt-2">
          Khi xóa tài khoản, bạn sẽ không còn có quyền truy cập các thông tin
          được lưu trữ trong tài khoản adidas của mình, chẳng hạn như lịch sử
          đặt hàng hoặc danh sách yêu thích
        </p>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={24} />
            </button>

            <nav className="flex gap-4 sm:gap-8 ml-auto">
              <button className="text-xs sm:text-sm font-medium hover:opacity-70">
                TIN TỨC
              </button>
              <button className="text-xs sm:text-sm font-medium hover:opacity-70">
                ĐƠN HÀNG
              </button>
              <button className="text-xs sm:text-sm font-medium border-b-2 border-black pb-5">
                TÀI KHOẢN
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={true}
        />

        {/* Desktop Sidebar */}
        <Sidebar isMobile={false} />

        <main className="flex-1 p-4 sm:p-6 lg:p-12 max-w-4xl">
          <UserInfoSection />
          <LoginDetailsSection />
        </main>
      </div>
    </div>
  );
};
