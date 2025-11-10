import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axiosCustom from "../../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const GoogleLoginButton = ({ isLogin }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  if (!clientId) {
    console.log("clientId is not existed");
  }

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axiosCustom.post("/api/user/login/google", {
        token,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setUser(res.data.user, res.data.accessToken);
        navigate("/");
      } else {
        toast.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId} oneTap={false}>
      <GoogleLogin
        size="large"
        width="100%"
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        theme="outline"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
