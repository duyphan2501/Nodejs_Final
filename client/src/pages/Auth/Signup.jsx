import { useState } from "react";
import FloatingShape from "../../components/FloatingShape";
import TextField from "@mui/material/TextField";
import PasswordTextField from "../../components/PasswordTextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import useUserStore from "../../store/useUserStore";
import BiLoader from "../../components/BiLoader";

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    fullname: "",
  });

  const [address, setAddress] = useState({
    
  });

  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (isLogin) return;
    setIsLogin(true);
    // Signup logic to be implemented
    setIsLogin(false);
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
      <div className="rounded-xl shadow border-gray-100 bg-white z-10 w-100 overflow-hidden">
        <form className="p-5">
          <h3 className="font-bold text-center mb-5 text-2xl ">Sign Up</h3>
          <div className="flex gap-5 flex-col">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <PasswordTextField
              size={"medium"}
              value={user.password}
              handleChange={(value) => handleChange("password", value)}
            />
          </div>

          <Button
            className="!bg-gray-700 !text-white !min-h-10 !font-bold !uppercase gap-2 items-center !w-full !mt-3"
            onClick={handleSignUp}
          >
            {!isLogin ? "Signup" : <BiLoader size={20} />}
          </Button>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-[0.5px] w-10 bg-black"></div>
            <p>Or continue with</p>
            <div className="h-[0.5px] w-10 bg-black"></div>
          </div>
          <div className="flex mt-3 gap-5 items-center justify-center">
            <div className="size-10 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition active:bg-gray-300">
              <FaFacebookF />
            </div>
            <div className="size-10 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition active:bg-gray-300">
              <FaGoogle />
            </div>
          </div>
        </form>
        <div className="bg-gray-800 text-center py-2 text-white">
          Already have account?{" "}
          <a href="/login" className="italic hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
