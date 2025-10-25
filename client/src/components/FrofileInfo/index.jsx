import React from "react";
import { ArrowRight } from "lucide-react";
import { useUser } from "../UserProvider";

const ProfileInfo = () => {
  const { user, loading, error, logoutAllBrowsers, deleteAccount } = useUser();

  const handleEdit = (section) => {
    console.log("Editing:", section);
  };

  const handleLogout = async () => {
    const result = await logoutAllBrowsers();
    if (result.success) {
      alert("Đã đăng xuất khỏi tất cả trình duyệt");
    } else {
      alert("Lỗi khi đăng xuất: " + result.error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản?")) {
      const result = await deleteAccount();
      if (result.success) {
        alert("Tài khoản đã được xóa");
      } else {
        alert("Lỗi khi xóa tài khoản: " + result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white shadow-sm">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          THÔNG TIN CỦA TÔI
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Hãy chỉnh sửa bất kỳ thông tin chi tiết nào bên dưới để tài khoản của
          bạn luôn được cập nhật.
        </p>
      </div>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          THÔNG TIN CHI TIẾT
        </h2>

        <div className="space-y-6 sm:space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  {user?.name || "TÊN NGƯỜI DÙNG"}
                </label>
                <p className="text-sm sm:text-base text-gray-900">
                  {user?.birthdate || "Chưa cập nhật"}
                </p>
              </div>
              <button
                onClick={() => handleEdit("name")}
                className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  GIỚI TÍNH
                </label>
                <p className="text-sm sm:text-base text-gray-900">
                  {user?.gender || "Chưa cập nhật"}
                </p>
              </div>
              <button
                onClick={() => handleEdit("gender")}
                className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          CHI TIẾT ĐĂNG NHẬP
        </h2>

        <div className="space-y-6 sm:space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  EMAIL
                </label>
                <p className="text-sm sm:text-base text-gray-900 break-all">
                  {user?.email || "Chưa cập nhật"}
                </p>
              </div>
              <button
                onClick={() => handleEdit("email")}
                className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all whitespace-nowrap"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  MẬT KHẨU
                </label>
                <p className="text-sm sm:text-base text-gray-900">
                  {user?.hasPassword ? "************" : "Chưa cập nhật"}
                </p>
              </div>
              <button
                onClick={() => handleEdit("password")}
                className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all"
              >
                CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          ĐĂNG XUẤT KHỎI TẤT CẢ TRÌNH DUYỆT WEB
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
          Thao tác này sẽ giúp bạn đăng xuất khỏi tất cả các trình duyệt web mà
          bạn đã sử dụng để truy cập vào trang web của adidas. Để đăng nhập lại,
          bạn sẽ phải nhập thông tin đăng nhập của mình.
        </p>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-8 py-3 bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 group"
        >
          <span>ĐĂNG XUẤT</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="border-t border-gray-200 pt-8 sm:pt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          QUẢN LÝ TÀI KHOẢN
        </h2>
        <button
          onClick={handleDeleteAccount}
          className="w-full sm:w-auto px-8 py-3 border-2 border-black text-black font-medium text-sm hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span>XÓA TÀI KHOẢN</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs sm:text-sm text-gray-500 mt-4 leading-relaxed">
          Khi xóa tài khoản, bạn sẽ không còn có quyền truy cập vào tất cả các
          thông tin được lưu trữ trong tài khoản adidas của mình, chẳng hạn như
          lịch sử đặt hàng hoặc danh sách yêu thích.
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
