import ProfileInfo from "../../components/FrofileInfo";
import AccountOverview from "../../components/AccountOverview";
import useUserStore from "../../store/useUserStore";
import { ChevronRight } from "lucide-react";

const MyAccount = () => {
  const { logout } = useUserStore();
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="container">
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="">
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900">
                  TỔNG QUAN TÀI KHOẢN
                </h1>
              </div>
              <AccountOverview />
              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-black hover:text-white transition-colors text-left group bg-white shadow-sm border-t border-gray-200"
              >
                <span className="text-gray-900 group-hover:text-white">
                  Đăng xuất
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
            </div>
            <div className="">
              <ProfileInfo />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
