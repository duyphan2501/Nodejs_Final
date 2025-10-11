import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownOrder({ choose }) {
  const [status, setStatus] = useState(choose);

  const statusColors = {
    waitting: "#FFD6A5",
    preparing: "#FFF9C4",
    shipping: "#BBDEFB",
    finishing: "#C8E6C9",
    cancelled: "#FFCDD2",
  };

  return (
    <FormControl
      sx={{
        minWidth: 200,
        width: {
          xs: "100%", // màn nhỏ
          sm: "50%", // màn sm trở lên
        },
      }}
    >
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{
          height: 36,
          borderRadius: "12px",
          fontWeight: 500,
          backgroundColor: statusColors[status] || "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <MenuItem value="waitting">Chờ Xác Nhận</MenuItem>
        <MenuItem value="preparing">Đang Chuẩn Bị</MenuItem>
        <MenuItem value="shipping">Đang Giao</MenuItem>
        <MenuItem value="finishing">Hoàn Thành</MenuItem>
        <MenuItem value="cancelled">Hủy Bỏ</MenuItem>
      </Select>
    </FormControl>
  );
}
