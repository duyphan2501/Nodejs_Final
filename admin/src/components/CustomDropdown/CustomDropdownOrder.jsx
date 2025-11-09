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
          <MenuItem value="pending">Đang xử lý</MenuItem>
          <MenuItem value="confirmed">Đã xác nhận</MenuItem>
          <MenuItem value="shipping">Đang vận chuyển</MenuItem>
          <MenuItem value="delivered">Đã giao</MenuItem>
          <MenuItem value="cancelled">Đã hủy</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
