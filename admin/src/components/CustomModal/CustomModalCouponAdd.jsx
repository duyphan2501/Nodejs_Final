import { Modal, Button, CircularProgress } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdownCouponType from "../CustomDropdown/CustomDropdownCouponType";
import CustomDropdown from "../CustomDropdown";
import useCoupon from "../../../hooks/useCoupon";

export default function CustomModalCouponAdd({ control }) {
  const { openAddCoupon, setOpenAddCoupon } = control;
  const { createCoupon, loading, fetchCoupons } = useCoupon();

  const [input, setInput] = useState({
    couponCode: "",
    discountValue: 0,
    discountType: "percent",
    minOrderValue: 0,
    maxDiscount: 0,
    status: "active",
  });

  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChangeInput = (key, value) => {
    if (key === "couponCode") {
      // Chỉ cho phép alphanumeric
      const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, "");
      // Giới hạn 5 ký tự
      setInput((prev) => ({
        ...prev,
        [key]: alphanumeric.slice(0, 5),
      }));
      return;
    }

    if (key === "discountValue") {
      const numValue = parseFloat(value) || 0;

      // Không cho phép giá trị âm
      if (numValue < 0) {
        setSaveError("Giá trị giảm không được âm");
        return;
      }

      // Nếu là phần trăm, không vượt quá 100%
      if (input.discountType === "percent" && numValue > 100) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        return;
      }

      setSaveError(null);
      setInput((prev) => ({
        ...prev,
        [key]: numValue,
      }));
      return;
    }

    if (key === "discountType") {
      if (value === "percent" && input.discountValue > 100) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        setInput((prev) => ({
          ...prev,
          [key]: value,
          discountValue: 0, // Reset về 0
        }));
        return;
      }

      setSaveError(null);
      setInput((prev) => ({
        ...prev,
        [key]: value,
      }));
      return;
    }

    if (["minOrderValue", "maxDiscount"].includes(key)) {
      const numValue = parseFloat(value) || 0;
      if (numValue < 0) {
        setSaveError(
          `${
            key === "minOrderValue" ? "Giá trị đơn hàng" : "Giảm tối đa"
          } không được âm`
        );
        return;
      }
      setSaveError(null);
      setInput((prev) => ({
        ...prev,
        [key]: numValue,
      }));
      return;
    }

    // Các field khác
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (!input.couponCode || input.couponCode.length < 5) {
        setSaveError("Mã coupon phải có đúng 5 ký tự alphanumeric");
        return;
      }

      if (!input.discountValue || input.discountValue <= 0) {
        setSaveError("Vui lòng nhập giá trị giảm hợp lệ");
        return;
      }

      if (input.discountType === "percent" && input.discountValue > 100) {
        setSaveError("Giảm giá theo % không được vượt quá 100%");
        return;
      }

      if (input.minOrderValue < 0 || input.maxDiscount < 0) {
        setSaveError("Các giá trị không được âm");
        return;
      }

      // Transform data từ frontend format sang backend format
      const couponData = {
        code: input.couponCode,
        discountType: input.discountType,
        remainingUsage: 10,
        minOrderValue: input.minOrderValue || 0,
        maxDiscountAmount: input.maxDiscount || 0,
        status: input.status || "active",
      };

      // Thêm discountPercent hoặc discountAmount
      if (input.discountType === "percent") {
        couponData.discountPercent = input.discountValue;
        couponData.discountAmount = 0;
      } else {
        couponData.discountAmount = input.discountValue;
        couponData.discountPercent = 0;
      }

      // Gọi API tạo coupon
      await createCoupon(couponData);

      setSaveSuccess(true);

      // Reset form
      setInput({
        couponCode: "",
        discountValue: 0,
        discountType: "percent",
        minOrderValue: 0,
        maxDiscount: 0,
        status: "active",
      });

      // Refresh danh sách coupons
      await fetchCoupons();

      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setOpenAddCoupon(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      setSaveError(error.response?.data?.message || "Lỗi khi tạo coupon");
    }
  };

  return (
    <Modal open={openAddCoupon} onClose={() => setOpenAddCoupon(false)}>
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
        {/* Thông báo lỗi/thành công */}
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Tạo coupon thành công!
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

        {/* Form nhập liệu */}
        <div className="w-full">
          <h1 className="text-xl font-bold mb-2">Thêm Coupon</h1>

          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <CustomInput
                name="couponCode"
                type="text"
                label="Mã Coupon "
                value={input.couponCode}
                handleChangeInput={handleChangeInput}
              />
              <p className="text-xs text-gray-500 mt-1">
                {input.couponCode.length}/5 ký tự
              </p>
            </div>

            <div>
              <CustomInput
                name="discountValue"
                type="number"
                label={`Giá trị giảm ${
                  input.discountType === "percent" ? "(tối đa 100%)" : "(VNĐ)"
                }`}
                value={input.discountValue}
                handleChangeInput={handleChangeInput}
              />
              {input.discountType === "percent" && (
                <p className="text-xs text-gray-500 mt-1">Giá trị từ 0-100%</p>
              )}
            </div>

            <div className="mb-2">
              <label className="text-black uppercase font-semibold">
                Loại giảm giá
              </label>
              <CustomDropdownCouponType
                choose={input.discountType}
                handleChangeInput={handleChangeInput}
              />
            </div>

            <CustomInput
              name="minOrderValue"
              type="number"
              label="Giá trị đơn hàng tối thiểu"
              value={input.minOrderValue}
              handleChangeInput={handleChangeInput}
            />

            <CustomInput
              name="maxDiscount"
              type="number"
              label="Giảm tối đa"
              value={input.maxDiscount}
              handleChangeInput={handleChangeInput}
            />

            <div className="mb-2">
              <label className="text-black uppercase font-semibold">
                Trạng thái
              </label>
              <CustomDropdown
                type="coupon"
                choose={input.status}
                handleChangeInput={handleChangeInput}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
