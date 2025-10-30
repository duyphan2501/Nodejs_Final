import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { MyContext } from "../../Context/MyContext";
import { toast } from "react-toastify";

const AddressForm = ({ address, setAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const { setIsOpenAddressForm } = useContext(MyContext);
  const [formData, setFormData] = useState( address || {
    receiver: "",
    phone: "",
    province: "",
    ward: "",
    addressType: "home",
    addressDetail: "",
    isDefault: false,
  });

  const loadWards = (provinceName, allProvinces, allWards) => {
    const selectedProvince = allProvinces.find(
      (item) => item.name === provinceName
    );
    if (!selectedProvince) return;

    const perspectiveWards = allWards.filter(
      (item) => item.province_code === selectedProvince.code
    );
    setWards(perspectiveWards);
  };

  const handleSaveAddress = () => {
    if (!formData.receiver) {
      toast.error("Tên người nhận không được để trống");
      return;
    }
    if (!formData.phone) {
      toast.error("Số điện thoại không được để trống");
      return;
    }
    if (!formData.province) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (!formData.ward) {
      toast.error("Vui lòng chọn xã/phường");
      return;
    }
    if (!formData.addressDetail) {
      toast.error("Địa chỉ cụ thể không được để trống");
      return;
    } 
    setAddress(formData);
    setIsOpenAddressForm(false);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, wRes] = await Promise.all([
          fetch("./provinces.json"),
          fetch("./wards.json"),
        ]);
        const provincesData = await pRes.json();
        const wardsData = await wRes.json();

        setProvinces(provincesData);
        setWardsList(wardsData);

        if (address.province) {
          loadWards(formData.province, provincesData, wardsData);
        }
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };
    loadData();
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvinceName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province: selectedProvinceName,
      ward: "", // reset ward khi đổi tỉnh
    }));
    loadWards(selectedProvinceName, provinces, wardsList);
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFormData = () => {
    setFormData({
      receiver: "",
      phone: "",
      province: "",
      ward: "",
      addressType: "home",
      addressDetail: "",
      isDefault: false,
    });
  };

  const closeAddrFrm = () => {
    setIsOpenAddressForm(false);
  };

  // useEffect(() => {
  //   document.body.style.overflow = isOpenAddrFrm ? "hidden" : "";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [isOpenAddrFrm]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (isLoadingAddress) return;
  //   let success = false;
  //   if (formData) {
  //     success = await updateAddress(
  //       {
  //         ...formData,
  //         id: formData._id,
  //       },
  //       axiosPrivate
  //     );
  //   } else {
  //     success = await createAddress(formData, axiosPrivate);
  //   }
  //   if (success) closeAddrFrm();
  // };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-100"></div>
      <div className="fixed inset-0 justify-center items-center flex z-200 ">
        <div className="bg-white p-5 z-50 border-b w-[500px] rounded-md shadow-lg">
          <div className="flex justify-between items-center border-b-2 pb-2 border-gray-300">
            <h4 className="font-semibold text-lg">
              {/* {updateAddr
            ? "Chỉnh Sửa Địa Chỉ Giao Hàng"
            : "Thêm Địa Chỉ Giao Hàng"} */}
              Thêm Địa Chỉ Giao Hàng
            </h4>
            <div
              className="size-8 rounded-full p-1 cursor-pointer hover:bg-gray-200 flex justify-center items-center"
              onClick={closeAddrFrm}
            >
              <IoClose size={25} />
            </div>
          </div>
          <div className="space-y-3 w-full mt-4">
            {/* Người nhận */}
            <div className="grid grid-cols-3 gap-2">
              <p>Tên người nhận:</p>
              <TextField
                variant="outlined"
                className="col-span-2"
                size="small"
                value={formData.receiver}
                onChange={handleChange("receiver")}
              />
            </div>

            {/* SĐT */}
            <div className="grid grid-cols-3 gap-2">
              <p>Số điện thoại:</p>
              <TextField
                variant="outlined"
                className="col-span-2"
                size="small"
                value={formData.phone}
                onChange={handleChange("phone")}
              />
            </div>

            {/* Tỉnh */}
            <div className="grid grid-cols-3 gap-2">
              <p>Tỉnh/Thành Phố:</p>
              <FormControl size="small" fullWidth className="col-span-2">
                <Select
                  value={formData.province}
                  onChange={handleProvinceChange}
                >
                  {provinces.map((item) => (
                    <MenuItem key={item.code} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Xã */}
            <div className="grid grid-cols-3 gap-2">
              <p>Xã/Phường:</p>
              <FormControl
                size="small"
                fullWidth
                className="col-span-2"
                disabled={!formData.province}
              >
                <Select value={formData.ward} onChange={handleChange("ward")}>
                  {wards.map((item) => (
                    <MenuItem key={item.code} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Địa chỉ cụ thể */}
            <div className="grid grid-cols-3 gap-2">
              <p>Địa chỉ cụ thể:</p>
              <TextField
                variant="outlined"
                className="col-span-2"
                size="small"
                multiline
                value={formData.addressDetail}
                onChange={handleChange("addressDetail")}
              />
            </div>

            {/* Loại địa chỉ */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <p>Loại địa chỉ:</p>
              <RadioGroup
                row
                value={formData.addressType}
                onChange={handleChange("addressType")}
                className="col-span-2"
              >
                <FormControlLabel
                  value="home"
                  control={<Radio />}
                  label="Nhà riêng"
                />
                <FormControlLabel
                  value="office"
                  control={<Radio />}
                  label="Nơi làm việc"
                />
              </RadioGroup>
            </div>

            {/* Mặc định & Submit */}
            <div className="flex justify-between items-center mt-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDefault}
                    onChange={handleChange("isDefault")}
                  />
                }
                label="Đặt làm mặc định"
              />
              <Button
                type="button"
                className="!bg-blue-500 !text-white !font-semibold hover:!bg-blue-700"
                onClick={handleSaveAddress}
              >
                {/* {isLoadingAddress ? fiLoader : "Lưu"} */}
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressForm;
