import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BiLoader from "../../components/BiLoader";
import { MapPinHouse, X } from "lucide-react";
import AddressSignUpForm from "../../components/Address/AddressSignUpForm";
import { MyContext } from "../../Context/MyContext";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    fullname: "",
  });
  const [address, setAddress] = useState({
    receiver: "",
    phone: "",
    province: "",
    ward: "",
    addressType: "home",
    addressDetail: "",
    isDefault: false,
  });

  const checkValidAddress = (addr) => {
    return (
      addr.receiver &&
      addr.phone &&
      addr.province &&
      addr.ward &&
      addr.addressDetail
    );
  };

  const clearAddress = () => {
    setAddress({
      receiver: "",
      phone: "",
      province: "",
      ward: "",
      addressType: "home",
      addressDetail: "",
      isDefault: false,
    });
  };

  const { isOpenAddressForm, setIsOpenAddressForm, setVerifyUser } =
    useContext(MyContext);
  const navigate = useNavigate();

  const signUp = useUserStore((s) => s.signUp);
  const isLoading = useUserStore((s) => s.isLoading);

  const handleUserChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isLoading.signUp) return;
    const { success, verifyUser } = await signUp(user);
    if (checkValidAddress(address)) {
    }
    if (success) navigate("/verify-account");
    else {
      if (verifyUser && !verifyUser?.isVerified) {
        setVerifyUser(verifyUser);
        navigate("/verify-account");
      }
    }
  };

  return (
    <div className="rounded-xl shadow border-gray-100 bg-white z-10 w-fit overflow-hidden">
      <div className="">
        <div className="w-100">
          <form className="p-5" onSubmit={handleSignUp}>
            <h3 className="font-bold text-center mb-5 text-3xl uppercase title">
              Đăng ký tài khoản
            </h3>
            <div className="flex gap-5 flex-col">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={user.email}
                type="email"
                onChange={(e) => handleUserChange("email", e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Họ tên"
                variant="outlined"
                value={user.fullname}
                onChange={(e) => handleUserChange("fullname", e.target.value)}
              />
            </div>
            <div className="relative mt-5">
              <Button
                className="!border-gray-300 !border-2 !text-black !min-h-13 !font-semibold !text-[13px] gap-2 items-center !w-full"
                onClick={() => setIsOpenAddressForm(true)}
              >
                {!checkValidAddress(address) ? (
                  <div className="flex items-center gap-2">
                    Thêm địa chỉ giao hàng <MapPinHouse size={16} />
                  </div>
                ) : (
                  <div className="text-left font-normal normal-case text-sm">
                    <div>
                      Người nhận:{" "}
                      <span className="font-medium">{address.receiver}</span>
                    </div>
                    <div className="">
                      <span>SĐT: </span>
                      <span className="font-medium">{address.phone}</span>
                    </div>
                    <div className="">
                      <span>Địa chỉ: </span>
                      <span className="font-medium italic">
                        {address.addressDetail}, {address.ward},{" "}
                        {address.province}, Việt Nam
                      </span>
                    </div>
                  </div>
                )}
              </Button>
              {checkValidAddress(address) && (
                <div
                  className="absolute -top-2 -right-2 bg-gray-700 font-bold z-100 p-1 cursor-pointer hover:bg-red-500 rounded-full text-white"
                  onClick={clearAddress}
                >
                  <X size={16} />
                </div>
              )}
            </div>

            <Button
              className="!bg-gray-700 !text-white !min-h-10 !font-bold !uppercase gap-2 items-center !w-full !mt-5 hover:!bg-gray-900"
              type="submit"
            >
              {!isLoading.signUp ? "Đăng ký" : <BiLoader size={20} />}
            </Button>
          </form>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-2 text-white text-sm">
        Đã có tài khoản?{" "}
        <a href="/login" className="italic hover:underline">
          Đăng nhập ngay
        </a>
      </div>
      {isOpenAddressForm && (
        <AddressSignUpForm address={address} setAddress={setAddress} />
      )}
    </div>
  );
};

export default Signup;
