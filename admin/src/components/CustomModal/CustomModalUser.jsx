import { Modal, CircularProgress } from "@mui/material";
import avatarUser from "../../assets/svg/avatar_user.svg";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomInput from "../CustomInput";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// Component hiển thị danh sách địa chỉ - THÊM MỚI
const AddressSwiper = ({ addresses }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <p className="text-gray-500 text-sm p-4 text-center bg-gray-50 rounded-lg">
        Chưa có địa chỉ nào
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((address, index) => (
        <div
          key={address._id || index}
          className="bg-white p-4 cursor-pointer text-gray-700 border border-gray-300 h-auto min-h-[160px] flex flex-col gap-2 rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-1">
            <h5 className="font-bold text-lg">{address.receiver}</h5>
            {address.isDefault && (
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">📞 {address.phone}</p>
          <p className="text-sm text-gray-600">{address.addressDetail}</p>
          <p className="text-sm text-gray-600">
            {address.ward}, {address.province}
          </p>
          <span className="text-xs text-gray-500 mt-auto">
            {address.addressType === "home" ? "🏠 Nhà riêng" : "🏢 Văn phòng"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CustomModalUser() {
  const axiosPrivate = useAxiosPrivate();
  const { selectedDetail, setSelectedDetail, selectedUserId, refreshData } =
    useTableControl();

  // State cho user data
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // State cho form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    purchasePoint: 0,
  });

  useEffect(() => {
    if (selectedDetail && selectedUserId) {
      fetchUserDetail();
    }
  }, [selectedDetail, selectedUserId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      // Lấy thông tin user
      const userResponse = await axiosPrivate.get(`api/user/${selectedUserId}`);

      if (userResponse.data.success) {
        const user = userResponse.data.data;
        setUserData(user);

        // Tách firstName và lastName từ name
        const nameParts = user.name?.split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          firstName: firstName,
          lastName: lastName,
          username: user.email || "", // Nếu không có username, dùng email
          email: user.email || "",
          phone: user.phone || "",
          purchasePoint: user.purchasePoint || 0,
        });

        // Lấy danh sách địa chỉ nếu có
        if (user.addresses && user.addresses.length > 0) {
          setAddresses(user.addresses);
        } else {
          // Hoặc fetch riêng
          fetchUserAddresses();
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi khi tải dữ liệu";
      toast.error(errorMessage);
      console.error("Error fetching user:", error);
      setSelectedDetail(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      console.log("Fetching addresses for user:", selectedUserId);

      const response = await axiosPrivate.get(
        `api/user/${selectedUserId}/addresses`
      );

      console.log("Addresses Response:", response);
      console.log("Addresses Data:", response.data);

      if (response.data.success) {
        console.log("Setting addresses:", response.data.data);
        setAddresses(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      console.error("Error response:", error.response);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Gộp firstName và lastName thành name
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
      };

      const response = await axiosPrivate.put(
        `api/user/${selectedUserId}`,
        updateData
      );

      if (response.data.success) {
        toast.success(response.data.message || "Cập nhật thông tin thành công");

        // Refresh data và đóng modal
        if (refreshData) {
          refreshData();
        }
        setSelectedDetail(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi khi cập nhật";
      toast.error(errorMessage);
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedDetail(false);
    setUserData(null);
    setAddresses([]);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Format status
  const getStatusDisplay = (status) => {
    if (status === "active") {
      return {
        text: "Hoạt động",
        bgColor: "bg-[#DFF8ED]",
        textColor: "text-green-700",
      };
    }
    return {
      text: "Ngừng hoạt động",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    };
  };

  return (
    <Modal open={selectedDetail} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px 40px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          minWidth: "80%",
          maxHeight: "600px",
          overflow: "auto",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <CircularProgress />
          </div>
        ) : userData ? (
          <>
            <div className="w-full flex justify-end">
              <Button
                variant="contained"
                disabled={saving}
                sx={{
                  width: "200px",
                  padding: "10px 10px",
                  background: "#00C950",
                  "&:hover": {
                    background: "#00B045",
                  },
                }}
                onClick={handleSave}
              >
                {saving ? "Đang lưu..." : "Lưu Thông Tin"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="user-info flex flex-col items-center">
                <h1 className="text-lg font-bold w-full text-left">Profile</h1>
                <img
                  src={userData.avatar || avatarUser}
                  className="w-20 h-20 rounded-full object-cover"
                  alt="Avatar"
                />
                <h4 className="text-xl font-bold mt-5">{userData.name}</h4>
                <h6 className="text-blue-500 text-sm">
                  {formatCurrency(userData.purchasePoint)} Điểm
                </h6>

                <div className="detail-info w-full mt-5 text-left">
                  <h6 className="text-sm font-bold uppercase">Email</h6>
                  <p className="text-sm">{userData.email}</p>

                  <h6 className="text-sm mt-3 font-bold uppercase">
                    Số điện thoại
                  </h6>
                  <p className="text-sm">{userData.phone || "Chưa cập nhật"}</p>

                  <h6 className="text-sm mt-3 font-bold uppercase">
                    Trạng thái
                  </h6>
                  <p
                    className={`p-2 ${
                      getStatusDisplay(userData.status).bgColor
                    } ${
                      getStatusDisplay(userData.status).textColor
                    } w-30 text-center text-sm rounded-md`}
                  >
                    {getStatusDisplay(userData.status).text}
                  </p>

                  <h6 className="text-sm mt-3 font-bold uppercase">Admin</h6>
                  <p className="text-sm">{userData.isAdmin ? "Có" : "Không"}</p>

                  <h6 className="text-sm mt-3 font-bold uppercase">Ngày tạo</h6>
                  <p className="text-sm">
                    {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
                  </p>

                  <h6 className="text-sm mt-10 font-bold uppercase">
                    Tổng chi
                  </h6>
                  <p className="text-2xl uppercase font-bold">
                    {formatCurrency(userData.totalSpent || 0)}₫
                  </p>
                </div>
              </div>

              <div className="col-span-2 w-full overflow-y-auto">
                <h1 className="text-xl font-bold">Profile Settings</h1>

                <h6 className="text-sm mt-4 font-bold uppercase mb-2">
                  Sổ địa chỉ ({addresses.length} địa chỉ)
                </h6>
                {/* SỬA: Thay CustomSwiper bằng AddressSwiper */}
                <AddressSwiper addresses={addresses} />

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <CustomInput
                    type={"text"}
                    id={"firstName"}
                    label={"Họ"}
                    name={"firstName"}
                    value={formData.firstName}
                    handleChangeInput={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"lastName"}
                    label={"Tên"}
                    name={"lastName"}
                    value={formData.lastName}
                    handleChangeInput={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"username"}
                    label={"Username"}
                    name={"username"}
                    value={formData.username}
                    disabled
                    handleChangeInput={handleInputChange}
                  />
                  <CustomInput
                    type={"email"}
                    id={"email"}
                    label={"Email"}
                    name={"email"}
                    value={formData.email}
                    disabled
                    handleChangeInput={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"phone"}
                    label={"Số điện thoại"}
                    name={"phone"}
                    value={formData.phone}
                    handleChangeInput={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"purchasePoint"}
                    label={"Điểm thưởng"}
                    name={"purchasePoint"}
                    value={formatCurrency(formData.purchasePoint)}
                    disabled
                    handleChangeInput={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p>Không tìm thấy thông tin người dùng</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
