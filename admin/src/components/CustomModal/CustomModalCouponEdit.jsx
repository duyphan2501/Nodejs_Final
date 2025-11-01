import { Modal, Button, Paper } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdown from "../CustomDropdown";

export default function CustomModalCouponEdit() {
  const { selectedDetail, setSelectedDetail, couponData } = useTableControl();
  const [addProductOpen, setAddProductOpen] = useState(false);

  const coupon = couponData[0];

  return (
    <Modal open={selectedDetail} onClose={() => setSelectedDetail(false)}>
      <>
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
          {/* Nút lưu */}
          <div className="w-full flex justify-end mb-4">
            <Button
              variant="contained"
              sx={{
                width: "200px",
                padding: "10px 10px",
                background: "#00C950",
              }}
              onClick={() => setSelectedDetail(false)}
            >
              Lưu Thông Tin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cột trái - Thông tin coupon */}
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold mb-2">Thông tin Coupon</h1>
              <p>
                <strong>Mã Coupon:</strong> {coupon.couponCode}
              </p>

              <p>
                <strong>Loại giảm giá:</strong>{" "}
                {coupon.discountType === "percentage"
                  ? `Giảm ${coupon.discountValue}%`
                  : `Giảm ${coupon.discountValue.toLocaleString()}₫`}
              </p>
              <p>
                <strong>Thời gian:</strong> {coupon.startDate} -{" "}
                {coupon.endDate}
              </p>
              <p>
                <strong>Giá trị tối thiểu:</strong>{" "}
                {coupon.minOrderValue.toLocaleString()}₫
              </p>
              <p>
                <strong>Giảm tối đa:</strong>{" "}
                {coupon.maxDiscount.toLocaleString()}₫
              </p>
              <p>
                <strong>Đã sử dụng:</strong> {coupon.used}/{coupon.quantity}
              </p>

              <div className="mt-3">
                <h6 className="text-sm font-bold uppercase">Trạng thái</h6>
                <CustomDropdown type="coupon" choose={coupon.status} />
              </div>
            </div>

            {/* Cột phải - Chỉnh sửa */}
            <div className="col-span-2 w-full">
              <h1 className="text-xl font-bold mb-2">Chỉnh sửa Coupon</h1>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <CustomInput
                  type="text"
                  label="Mã Coupon"
                  value={coupon.couponCode}
                />

                <CustomInput
                  type="number"
                  label="Giá trị giảm"
                  value={coupon.discountValue}
                />
                <div className="mb-2">
                  <label className="text-black uppercase font-semibold">
                    Loại giảm giá
                  </label>
                  <CustomDropdown
                    type="coupon-edit"
                    choose={coupon.discountType}
                  />
                </div>
                <CustomInput
                  type="date"
                  label="Ngày bắt đầu"
                  value={coupon.startDate}
                />
                <CustomInput
                  type="date"
                  label="Ngày kết thúc"
                  value={coupon.endDate}
                />
                <CustomInput
                  type="number"
                  label="Giá trị tối thiểu"
                  value={coupon.minOrderValue}
                />
                <CustomInput
                  type="number"
                  label="Giảm tối đa"
                  value={coupon.maxDiscount}
                />
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-2"></div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}
