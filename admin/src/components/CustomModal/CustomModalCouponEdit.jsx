// components/CustomModal/CustomModalCouponEdit.jsx
import { Modal, Button, CircularProgress } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState, useEffect } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdown from "../CustomDropdown";
import CustomDropdownCoupon from "../CustomDropdown/CustomDropdownCoupon";
import useCoupon from "../../../hooks/useCoupon";
import useCouponStore from "../../../stores/useCouponStore";

export default function CustomModalCouponEdit() {
  const { selectedDetail, setSelectedDetail, selectedCouponId, couponData } =
    useTableControl();
  const { updateCoupon, loading } = useCoupon();
  const { coupons } = useCouponStore();

  const couponFromStore = coupons.find((c) => c._id === selectedCouponId);
  const couponFromData = couponData.find((c) => c._id === selectedCouponId);
  const coupon = couponFromStore || couponFromData;

  // State để quản lý dữ liệu chỉnh sửa
  const [editedCoupon, setEditedCoupon] = useState({
    _id: "",
    couponCode: "",
    discountType: "percentage",
    discountValue: 0,
    startDate: "",
    endDate: "",
    minOrderValue: 0,
    maxDiscount: 0,
    quantity: 10,
    used: 0,
    status: "active",
  });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset dữ liệu khi mở modal
  useEffect(() => {
    if (selectedDetail && coupon) {
      // Kiểm tra xem coupon đã ở format frontend hay backend
      const isBackendFormat = coupon.code !== undefined;

      if (isBackendFormat) {
        // Transform từ backend format
        setEditedCoupon({
          _id: coupon._id,
          couponCode: coupon.code,
          discountType:
            coupon.discountType === "percent" ? "percentage" : "fixed",
          discountValue:
            coupon.discountType === "percent"
              ? coupon.discountPercent
              : coupon.discountAmount,
          startDate: coupon.createdAt
            ? new Date(coupon.createdAt).toISOString().split("T")[0]
            : "",
          endDate: "",
          minOrderValue: coupon.minOrderValue || 0,
          maxDiscount: coupon.maxDiscountAmount || 0,
          quantity: 10,
          used: 10 - (coupon.remainingUsage || 0),
          status: coupon.status || "active",
        });
      } else {
        // Đã ở frontend format
        setEditedCoupon(coupon);
      }

      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [selectedDetail, coupon]);

  // Hàm xử lý thay đổi input
  const handleChangeInput = (field, value) => {
    setEditedCoupon((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm lưu thông tin
  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Kiểm tra xem coupon có _id không
      if (!editedCoupon._id) {
        setSaveError("Không tìm thấy ID coupon");
        console.error("Coupon data:", editedCoupon);
        return;
      }

      const couponId = editedCoupon._id;

      // Transform dữ liệu từ frontend format sang backend format
      const updateData = {
        code: editedCoupon.couponCode,
        status: editedCoupon.status,
        minOrderValue: editedCoupon.minOrderValue,
        maxDiscountAmount: editedCoupon.maxDiscount,
        remainingUsage: editedCoupon.quantity - editedCoupon.used,
        discountType:
          editedCoupon.discountType === "percentage" ? "percent" : "fixed",
      };

      // Thêm discountPercent hoặc discountAmount tùy theo loại
      if (editedCoupon.discountType === "percentage") {
        updateData.discountPercent = editedCoupon.discountValue;
        updateData.discountAmount = 0;
      } else {
        updateData.discountAmount = editedCoupon.discountValue;
        updateData.discountPercent = 0;
      }

      // Gọi API cập nhật
      await updateCoupon(couponId, updateData);

      setSaveSuccess(true);

      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setSelectedDetail(false);
      }, 1500);
    } catch (error) {
      setSaveError(error.message || "Lỗi khi cập nhật coupon");
    }
  };

  return (
    <Modal open={selectedDetail} onClose={() => setSelectedDetail(false)}>
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
        {/* Kiểm tra nếu không có dữ liệu */}
        {!coupon ? (
          <div className="text-center p-4">
            <p className="text-red-500">Không tìm thấy dữ liệu coupon</p>
          </div>
        ) : (
          <>
            {/* Thông báo lỗi/thành công */}
            {saveError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                Cập nhật coupon thành công!
              </div>
            )}

            {/* Nút lưu */}
            <div className="w-full flex justify-end mb-4">
              <Button
                variant="contained"
                sx={{
                  width: "200px",
                  padding: "10px 10px",
                  background: "#00C950",
                }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Lưu Thông Tin"
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cột trái - Thông tin coupon */}
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold mb-2">Thông tin Coupon</h1>
                <p>
                  <strong>Mã Coupon:</strong> {editedCoupon.couponCode}
                </p>

                <p>
                  <strong>Loại giảm giá:</strong>{" "}
                  {editedCoupon.discountType === "percentage"
                    ? `Giảm ${editedCoupon.discountValue}%`
                    : `Giảm ${editedCoupon.discountValue.toLocaleString()}₫`}
                </p>
                <p>
                  <strong>Thời gian:</strong> {editedCoupon.startDate} -{" "}
                  {editedCoupon.endDate}
                </p>
                <p>
                  <strong>Giá trị tối thiểu:</strong>{" "}
                  {editedCoupon.minOrderValue.toLocaleString()}₫
                </p>
                <p>
                  <strong>Giảm tối đa:</strong>{" "}
                  {editedCoupon.maxDiscount.toLocaleString()}₫
                </p>
                <p>
                  <strong>Đã sử dụng:</strong> {editedCoupon.used}/
                  {editedCoupon.quantity}
                </p>

                <div className="mt-3">
                  <h6 className="text-sm font-bold uppercase">Trạng thái</h6>
                  <CustomDropdownCoupon
                    choose={editedCoupon.status}
                    handleChangeInput={handleChangeInput}
                  />
                </div>
              </div>

              {/* Cột phải - Chỉnh sửa */}
              <div className="col-span-2 w-full">
                <h1 className="text-xl font-bold mb-2">Chỉnh sửa Coupon</h1>

                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <CustomInput
                    type="text"
                    id="couponCode"
                    label="Mã Coupon"
                    name="couponCode"
                    value={editedCoupon.couponCode}
                    handleChangeInput={handleChangeInput}
                  />

                  <CustomInput
                    type="number"
                    id="discountValue"
                    label="Giá trị giảm"
                    name="discountValue"
                    value={editedCoupon.discountValue}
                    handleChangeInput={handleChangeInput}
                  />
                  <div className="mb-2">
                    <label className="text-black uppercase font-semibold">
                      Loại giảm giá
                    </label>
                    <CustomDropdown
                      type="coupon-edit"
                      choose={editedCoupon.discountType}
                    />
                  </div>
                  <CustomInput
                    type="date"
                    id="startDate"
                    label="Ngày bắt đầu"
                    name="startDate"
                    value={editedCoupon.startDate}
                    handleChangeInput={handleChangeInput}
                  />

                  <CustomInput
                    type="number"
                    id="minOrderValue"
                    label="Giá trị tối thiểu"
                    name="minOrderValue"
                    value={editedCoupon.minOrderValue}
                    handleChangeInput={handleChangeInput}
                  />
                  <CustomInput
                    type="number"
                    id="maxDiscount"
                    label="Giảm tối đa"
                    name="maxDiscount"
                    value={editedCoupon.maxDiscount}
                    handleChangeInput={handleChangeInput}
                  />
                </div>

                <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-2"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
