import { Modal, Button, Paper } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdown from "../CustomDropdown";

export default function CustomModalCouponAdd({ control }) {
  const { couponData } = useTableControl();
  const { openAddCoupon, setOpenAddCoupon } = control;
  const [input, setInput] = useState({});

  const handleChangeInput = (key, value) => {
    setInput((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  console.log(input);

  const coupon = couponData[0];

  return (
    <Modal open={openAddCoupon} onClose={() => setOpenAddCoupon(false)}>
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
              onClick={() => setOpenAddCoupon(false)}
            >
              Lưu Thông Tin
            </Button>
          </div>

          {/* Cột phải - Chỉnh sửa */}
          <div className=" w-full">
            <h1 className="text-xl font-bold mb-2">Thêm Coupon</h1>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <CustomInput
                name={"couponCode"}
                type="text"
                label="Mã Coupon"
                value={input.couponCode || ""}
                handleChangeInput={handleChangeInput}
              />

              <CustomInput
                name={"discountValue"}
                type="number"
                label="Giá trị giảm"
                value={input.discountValue || ""}
                handleChangeInput={handleChangeInput}
              />
              <div className="mb-2">
                <label className="text-black uppercase font-semibold">
                  Loại giảm giá
                </label>
                <CustomDropdown
                  type="coupon"
                  choose={input.status || "active"}
                  handleChangeInput={handleChangeInput}
                />
              </div>
              <CustomInput
                name={"startDate"}
                type="date"
                label="Ngày bắt đầu"
                value={input.startDate || new Date()}
                handleChangeInput={handleChangeInput}
              />
              <CustomInput
                name={"endDate"}
                type="date"
                label="Ngày kết thúc"
                value={input.endDate || new Date()}
                handleChangeInput={handleChangeInput}
              />
              <CustomInput
                name={"minValue"}
                type="number"
                label="Giá trị tối thiểu"
                value={input.minValue || ""}
                handleChangeInput={handleChangeInput}
              />
              <CustomInput
                name={"maxDiscount"}
                type="number"
                label="Giảm tối đa"
                value={input.maxDiscount || ""}
                handleChangeInput={handleChangeInput}
              />
            </div>

            {/* Danh sách giày áp dụng */}

            <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-2"></div>
          </div>
        </div>
      </>
    </Modal>
  );
}
