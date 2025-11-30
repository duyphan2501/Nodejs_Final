// components/CustomModal/CustomModalCouponEdit.jsx
import { Modal, Button, CircularProgress } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState, useEffect } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdown from "../CustomDropdown";
import CustomDropdownCoupon from "../CustomDropdown/CustomDropdownCoupon";
import CustomDropdownCouponType from "../CustomDropdown/CustomDropdownCouponType"; // ✅ DÙNG CÁI NÀY
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

  const [editedCoupon, setEditedCoupon] = useState({
    _id: "",
    couponCode: "",
    discountType: "percent",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    quantity: 10,
    used: 0,
    status: "active",
  });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (selectedDetail && coupon) {
      const isBackendFormat = coupon.code !== undefined;

      if (isBackendFormat) {
        setEditedCoupon({
          _id: coupon._id,
          couponCode: coupon.code,
          discountType: coupon.discountType,
          discountValue:
            coupon.discountType === "percent"
              ? coupon.discountPercent
              : coupon.discountAmount,
          minOrderValue: coupon.minOrderValue || 0,
          maxDiscount: coupon.maxDiscountAmount || 0,
          quantity: 10,
          used: 10 - (coupon.remainingUsage || 0),
          status: coupon.status || "active",
        });
      } else {
        setEditedCoupon({
          ...coupon,
          discountType:
            coupon.discountType === "percentage" ? "percent" : "fixed",
        });
      }

      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [selectedDetail, coupon]);

  // Hàm xử lý thay đổi input
  const handleChangeInput = (field, value) => {
    if (field === "couponCode") {
      const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, "");
      setEditedCoupon((prev) => ({
        ...prev,
        [field]: alphanumeric.slice(0, 5),
      }));
      return;
    }

    if (field === "discountValue") {
      const numValue = parseFloat(value) || 0;

      if (numValue < 0) {
        setSaveError("Giá trị giảm không được âm");
        return;
      }

      if (editedCoupon.discountType === "percent" && numValue > 100) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        return;
      }

      setSaveError(null);
      setEditedCoupon((prev) => ({
        ...prev,
        [field]: numValue,
      }));
      return;
    }

    if (field === "discountType") {
      if (value === "percent" && editedCoupon.discountValue > 100) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        setEditedCoupon((prev) => ({
          ...prev,
          [field]: value,
          discountValue: 0,
        }));
        return;
      }

      setSaveError(null);
      setEditedCoupon((prev) => ({
        ...prev,
        [field]: value,
      }));
      return;
    }

    if (["minOrderValue", "maxDiscount"].includes(field)) {
      const numValue = parseFloat(value) || 0;
      if (numValue < 0) {
        setSaveError(
          `${
            field === "minOrderValue" ? "Giá trị đơn hàng" : "Giảm tối đa"
          } không được âm`
        );
        return;
      }
      setSaveError(null);
      setEditedCoupon((prev) => ({
        ...prev,
        [field]: numValue,
      }));
      return;
    }

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
      if (!editedCoupon._id) {
        setSaveError("Không tìm thấy ID coupon");
        return;
      }

      if (!editedCoupon.couponCode || editedCoupon.couponCode.length < 5) {
        setSaveError("Mã coupon phải có đúng 5 ký tự alphanumeric");
        return;
      }

      if (!editedCoupon.discountValue || editedCoupon.discountValue <= 0) {
        setSaveError("Vui lòng nhập giá trị giảm hợp lệ");
        return;
      }

      if (
        editedCoupon.discountType === "percent" &&
        editedCoupon.discountValue > 100
      ) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        return;
      }

      if (editedCoupon.minOrderValue < 0 || editedCoupon.maxDiscount < 0) {
        setSaveError("Các giá trị không được âm");
        return;
      }

      const couponId = editedCoupon._id;

      const updateData = {
        code: editedCoupon.couponCode,
        status: editedCoupon.status,
        minOrderValue: editedCoupon.minOrderValue,
        maxDiscountAmount: editedCoupon.maxDiscount,
        remainingUsage: editedCoupon.quantity - editedCoupon.used,
        discountType: editedCoupon.discountType,
      };

      if (editedCoupon.discountType === "percent") {
        updateData.discountPercent = editedCoupon.discountValue;
        updateData.discountAmount = 0;
      } else {
        updateData.discountAmount = editedCoupon.discountValue;
        updateData.discountPercent = 0;
      }

      const result = await updateCoupon(couponId, updateData);

      setSaveSuccess(true);

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
        {!coupon ? (
          <div className="text-center p-4">
            <p className="text-red-500">Không tìm thấy dữ liệu coupon</p>
          </div>
        ) : (
          <>
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
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold mb-2">Thông tin Coupon</h1>
                <p>
                  <strong>Mã Coupon:</strong> {editedCoupon.couponCode}
                </p>

                <p>
                  <strong>Loại giảm giá:</strong>{" "}
                  {editedCoupon.discountType === "percent"
                    ? `Giảm ${editedCoupon.discountValue}%`
                    : `Giảm ${editedCoupon.discountValue.toLocaleString()}₫`}
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

              <div className="col-span-2 w-full">
                <h1 className="text-xl font-bold mb-2">Chỉnh sửa Coupon</h1>

                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <CustomInput
                      type="text"
                      id="couponCode"
                      label="Mã Coupon "
                      name="couponCode"
                      value={editedCoupon.couponCode}
                      handleChangeInput={handleChangeInput}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editedCoupon.couponCode.length}/5 ký tự
                    </p>
                  </div>

                  <div>
                    <CustomInput
                      type="number"
                      id="discountValue"
                      label={`Giá trị giảm ${
                        editedCoupon.discountType === "percent"
                          ? "(tối đa 100%)"
                          : "(VNĐ)"
                      }`}
                      name="discountValue"
                      value={editedCoupon.discountValue}
                      handleChangeInput={handleChangeInput}
                    />
                    {editedCoupon.discountType === "percent" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Giá trị từ 0-100%
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="text-black uppercase font-semibold">
                      Loại giảm giá
                    </label>
                    <CustomDropdownCouponType
                      choose={editedCoupon.discountType}
                      handleChangeInput={handleChangeInput}
                    />
                  </div>

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
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
