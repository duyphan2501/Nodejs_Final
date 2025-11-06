import { ArrowRight } from "lucide-react";
import useUserStore from "../../store/useUserStore";
import PersonalInfo from "../PersonalInfo";
import ChangePassword from "../ChangePassword";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ProfileInfo = () => {
  const user = useUserStore((state) => state.user);
  const { updatePersonalInfo, logout, changePassword, isLoading } =
    useUserStore();
  const axiosPrivate = useAxiosPrivate();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

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
        <PersonalInfo
          user={user}
          handleSave={(name, phone) =>
            updatePersonalInfo(name, phone, axiosPrivate)
          }
        />
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
              {/* <button
                onClick={() => handleEdit("email")}
                className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all whitespace-nowrap"
              >
                CHỈNH SỬA
              </button> */}
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="">
              <ChangePassword
                handleSave={async (formData) =>
                  await changePassword(formData, axiosPrivate)
                }
                isLoading={isLoading}
              />
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
    </div>
  );
};

export default ProfileInfo;
