import { Modal, CircularProgress } from "@mui/material";
import avatarUser from "../../assets/svg/avatar_user.svg";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomSwiper from "../CustomSwiper";
import CustomInput from "../CustomInput";
import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../../API/userAPI.js";
import { toast } from "react-toastify";

export default function CustomModalUser() {
  const { selectedDetail, setSelectedDetail, selectedUserId, refreshData } = useTableControl();
  
  // State cho user data
  const [userData, setUserData] = useState(null);
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

  // Fetch user data khi modal mở
  useEffect(() => {
    if (selectedDetail && selectedUserId) {
      fetchUserDetail();
    }
  }, [selectedDetail, selectedUserId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await getUserById(selectedUserId);
      const user = response.data;
      
      setUserData(user);
      
      // Tách firstName và lastName từ name
      const nameParts = user.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        purchasePoint: user.purchasePoint || 0,
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching user:", error);
      setSelectedDetail(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Gộp firstName và lastName thành name
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        // Không gửi email, username, purchasePoint vì backend không cho phép update
      };

      await updateUser(selectedUserId, updateData);
      toast.success("Cập nhật thông tin thành công");
      
      // Refresh data và đóng modal
      if (refreshData) {
        refreshData();
      }
      setSelectedDetail(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedDetail(false);
    setUserData(null);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Format status
  const getStatusDisplay = (status) => {
    if (status === "active") {
      return {
        text: "Hoạt động",
        bgColor: "bg-[#DFF8ED]",
        textColor: "text-green-700"
      };
    }
    return {
      text: "Ngừng hoạt động",
      bgColor: "bg-red-100",
      textColor: "text-red-700"
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

                  <h6 className="text-sm mt-3 font-bold uppercase">Địa chỉ</h6>
                  <p className="text-sm">
                    {userData.address || "Chưa cập nhật địa chỉ"}
                  </p>

                  <h6 className="text-sm mt-3 font-bold uppercase">Trạng thái</h6>
                  <p className={`p-2 ${getStatusDisplay(userData.status).bgColor} ${getStatusDisplay(userData.status).textColor} w-30 text-center text-sm rounded-md`}>
                    {getStatusDisplay(userData.status).text}
                  </p>

                  <h6 className="text-sm mt-3 font-bold uppercase">Admin</h6>
                  <p className="text-sm">
                    {userData.isAdmin ? "Có" : "Không"}
                  </p>

                  <h6 className="text-sm mt-3 font-bold uppercase">Ngày tạo</h6>
                  <p className="text-sm">
                    {new Date(userData.createdAt).toLocaleDateString('vi-VN')}
                  </p>

                  <h6 className="text-sm mt-10 font-bold uppercase">Tổng chi</h6>
                  <p className="text-2xl uppercase font-bold">
                    {formatCurrency(userData.totalSpent || 0)}₫
                  </p>
                </div>
              </div>

              <div className="col-span-2 w-full overflow-y-auto">
                <h1 className="text-xl font-bold">Profile Settings</h1>
                
                {/* Hiển thị thông báo nếu có fields không thể edit */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Email, Username và Điểm thưởng không thể chỉnh sửa
                  </p>
                </div>

                <h6 className="text-sm mt-4 font-bold uppercase mb-2">
                  Sổ địa chỉ
                </h6>
                <CustomSwiper type={"user-detail"} />

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <CustomInput
                    type={"text"}
                    id={"firstName"}
                    label={"Họ"}
                    name={"firstName"}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"lastName"}
                    label={"Tên"}
                    name={"lastName"}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"username"}
                    label={"Username"}
                    name={"username"}
                    value={formData.username}
                    disabled
                    onChange={handleInputChange}
                  />
                  <CustomInput
                    type={"email"}
                    id={"email"}
                    label={"Email"}
                    name={"email"}
                    value={formData.email}
                    disabled
                    onChange={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"phone"}
                    label={"Số điện thoại"}
                    name={"phone"}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <CustomInput
                    type={"text"}
                    id={"purchasePoint"}
                    label={"Điểm thưởng"}
                    name={"purchasePoint"}
                    value={formatCurrency(formData.purchasePoint)}
                    disabled
                    onChange={handleInputChange}
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