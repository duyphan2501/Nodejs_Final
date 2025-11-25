import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import ConfirmDialog from "../ConfirmDialog";
import useOrderStore from "../../../stores/useOrderStore";

export default function CustomDropdownOrder({ choose, id }) {
  const [status, setStatus] = useState(choose);
  const [pendingStatus, setPendingStatus] = useState("");
  const [confirm, setConfirm] = useState(false);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const statusColors = {
    pending: "#FFF9C4",
    confirmed: "#BBDEFB",
    shipping: "#FFE0B2",
    delivered: "#C8E6C9",
    cancelled: "#FFCDD2",
  };

  const handleChangeSelect = (e) => {
    setPendingStatus(e.target.value);
    setConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setConfirm(false);
      await updateOrderStatus(id, pendingStatus);
      setStatus(pendingStatus);
    } catch (error) {
      setPendingStatus("");
    }
  };

  const statusOptions = {
    pending: [
      { value: "pending", label: "Đang xử lý" },
      { value: "confirmed", label: "Đã xác nhận" },
      { value: "shipping", label: "Đang vận chuyển" },
      { value: "delivered", label: "Đã giao" },
      { value: "cancelled", label: "Đã hủy" },
    ],
    confirmed: [
      { value: "confirmed", label: "Đã xác nhận" },
      { value: "shipping", label: "Đang vận chuyển" },
      { value: "delivered", label: "Đã giao" },
      { value: "cancelled", label: "Đã hủy" },
    ],
    shipping: [
      { value: "shipping", label: "Đang vận chuyển" },
      { value: "delivered", label: "Đã giao" },
      { value: "cancelled", label: "Đã hủy" },
    ],
    delivered: [{ value: "delivered", label: "Đã giao" }],
    cancelled: [{ value: "cancelled", label: "Đã hủy" }],
  };

  return (
    <>
      <ConfirmDialog
        onConfirm={handleConfirm}
        open={confirm}
        content={"Bạn có muốn cập nhật trạng thái đơn hàng?"}
        action={"Cập nhật"}
        onClose={() => setConfirm(false)}
      />

      <FormControl
        sx={{
          minWidth: 180,
          width: {
            xs: "100%",
            sm: "50%",
          },
        }}
      >
        <Select
          value={status}
          onChange={(e) => handleChangeSelect(e)}
          sx={{
            height: 36,
            borderRadius: "12px",
            fontWeight: 500,
            textAlign: "center",
            backgroundColor: statusColors[status] || "#F3F3F3",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          {statusOptions[status]?.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
