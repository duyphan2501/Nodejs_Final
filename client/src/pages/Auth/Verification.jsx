import { useContext, useEffect, useState } from "react";
import FloatingShape from "../../components/FloatingShape";
import TextField from "@mui/material/TextField";
import PasswordTextField from "../../components/PasswordTextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import BiLoader from "../../components/BiLoader";
import { MapPinHouse } from "lucide-react";
import AddressForm from "../../components/Address/AddressForm";
import { MyContext } from "../../Context/MyContext";
import useUserStore from "../../store/useUserStore";
import PasswordStrength from "../../components/PasswordStrength";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VerificationEmailDialog from "../../components/VerificationEmailDialog";

const Verification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate();
  const { verifyAccount, sendVerificationEmail, isLoading } = useUserStore();
  const { verifyUser } = useContext(MyContext);
  const [isOpenEmailDialog, setIsOpenEmailDialog] = useState(false);

  const [formData, setFormData] = useState({
    verificationToken: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResendCode = async () => {
    if (isLoading.resend) return;
    if (!verifyUser || !verifyUser.email) {
      setIsOpenEmailDialog(true);
    } else {
      await sendVerificationEmail(verifyUser.email);
    }
  };

  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    if (isVerifying) return;
    setIsVerifying(true);
    if (passwordScore < 5) {
      toast.info("Mật khẩu chưa đủ mạnh!");
      setIsVerifying(false);
      return;
    }
    const result = await verifyAccount(formData);
    if (result) navigate("/login");
    setIsVerifying(false);
  };

  return (
    <div className="h-screen bg-linear-to-r from-gray-300 via-gray-500 to-gray-700 flex items-center justify-center relative overflow-hidden z-1">
      <FloatingShape
        color={"bg-gray-400"}
        size={"size-64"}
        top={"top-[5%]"}
        left={"left-[2%]"}
        delay={0}
      />
      <FloatingShape
        color={"bg-gray-600"}
        size={"size-48"}
        top={"top-[60%]"}
        left={"left-[70%]"}
        delay={5}
      />
      <FloatingShape
        color={"bg-gray-600"}
        size={"size-32"}
        top={"top-[10%]"}
        left={"left-[80%]"}
        delay={5}
      />
      <div className="rounded-xl shadow border-gray-100 bg-white z-10 w-fit overflow-hidden">
        <div className="">
          <div className="w-100">
            <form className="p-5" onSubmit={handleVerifyAccount}>
              <h3 className="font-bold text-center mb-5 text-2xl ">
                Xác thực tài khoản
              </h3>
              <div className="flex gap-5 flex-col">
                <TextField
                  id="outlined-basic"
                  label="Mã xác thực"
                  variant="outlined"
                  value={formData.verificationToken}
                  onChange={(e) =>
                    handleChange("verificationToken", e.target.value)
                  }
                />
                <PasswordTextField
                  size={"medium"}
                  value={formData.password}
                  handleChange={(value) => handleChange("password", value)}
                  label="Đặt mật khẩu"
                />
                <PasswordTextField
                  size={"medium"}
                  value={formData.confirmPassword}
                  handleChange={(value) =>
                    handleChange("confirmPassword", value)
                  }
                  label="Xác nhận mật khẩu"
                />
              </div>
              <div className="mt-5">
                <PasswordStrength
                  password={formData.password}
                  setPasswordScore={setPasswordScore}
                />
              </div>

              <Button
                className="!bg-gray-700 !text-white !min-h-10 !font-bold !uppercase gap-2 items-center !w-full !mt-5 hover:!bg-gray-900"
                type="submit"
              >
                {!isLoading.verify ? "Xác thực" : <BiLoader size={20} />}
              </Button>
            </form>
          </div>
        </div>
        <div className="bg-gray-800 text-center py-2 text-white text-sm">
          Chưa nhận được mã?{" "}
          <button
            className="italic hover:underline cursor-pointer"
            onClick={handleResendCode}
          >
            {!isLoading.resend ? "Gửi lại mã" : "Đang gửi..."}
          </button>
        </div>
      </div>
      {isOpenEmailDialog && (
        <VerificationEmailDialog
          closeDialog={() => setIsOpenEmailDialog(false)}
        />
      )}
    </div>
  );
};

export default Verification;
