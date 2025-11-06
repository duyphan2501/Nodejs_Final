import { useState } from "react";
import PasswordStrength from "../PasswordStrength";
import { toast } from "react-toastify";
import BiLoader from "../BiLoader";
import PasswordTextField from "../PasswordTextField";

const ChangePassword = ({ handleSave, isLoading }) => {
  const [isEditPassword, setIsEditPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const [passwordScore, setPasswordScore] = useState(0);

  const handleSubmit = async () => {
    if (passwordScore < 5) {
      toast.info("Mật khẩu chưa đủ mạnh");
      return;
    }
    const res = await handleSave(passwordForm);
    if (res) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditPassword(false);
    }
  };

  const handleSetIsEdit = () => {
    const isEdit = isEditPassword;
    if (isEdit) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditPassword(!isEdit);
  };

  return (
    <div className="border-b border-gray-200 pb-6 mt-8 sm:mt-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              MẬT KHẨU
            </label>
            <button
              onClick={handleSetIsEdit}
              className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all cursor-pointer"
            >
              {isEditPassword ? "HUỶ" : " ĐỔI MẬT KHẨU"}
            </button>
          </div>

          {isEditPassword ? (
            <div className="mx-auto max-w-[400px] ">
              <div className="max-w-[400px] flex flex-col gap-4">
                {/* Mật khẩu hiện tại */}
                <PasswordTextField
                  size={"medium"}
                  value={passwordForm.currentPassword}
                  handleChange={(value) =>
                    handlePasswordChange("currentPassword", value)
                  }
                  label="Mật khẩu hiện tại"
                />

                {/* Mật khẩu mới */}
                <PasswordTextField
                  size={"medium"}
                  value={passwordForm.newPassword}
                  handleChange={(value) =>
                    handlePasswordChange("newPassword", value)
                  }
                  label="Mật khẩu mới"
                />
                <PasswordTextField
                  size={"medium"}
                  value={passwordForm.confirmPassword}
                  handleChange={(value) =>
                    handlePasswordChange("confirmPassword", value)
                  }
                  label="Xác nhận mật khẩu"
                />

                {/*  */}
                <PasswordStrength
                  password={passwordForm.newPassword}
                  setPasswordScore={setPasswordScore}
                />

                <button
                  className="p-2 font-semibold cursor-pointer hover:bg-gray-800 rounded bg-black text-white"
                  onClick={handleSubmit}
                >
                  {isLoading.change ? <BiLoader size={20} /> : "Xác nhận"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-900 mt-1">
              ************
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
