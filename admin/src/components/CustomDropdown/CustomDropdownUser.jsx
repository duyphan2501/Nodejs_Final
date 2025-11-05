import { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownUser({
  choose,
  userId,
  onStatusChange,
  type,
}) {
  const [status, setStatus] = useState(choose);

  // Đồng bộ state khi prop thay đổi
  useEffect(() => {
    setStatus(choose);
  }, [choose]);

  const statusColors = {
    active: "#C8E6C9",
    inactive: "#FFCDD2",
  };

  const handleChange = (e) => {
    e.stopPropagation(); // Ngăn event bubbling lên row
    const newStatus = e.target.value;
    setStatus(newStatus);

    // Gọi callback để gọi API (được truyền từ CustomTableUser)
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
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
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()} // Ngăn double click row
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
        <MenuItem value="active">Hoạt Động</MenuItem>
        <MenuItem value="inactive">Không Hoạt Động</MenuItem>
      </Select>
    </FormControl>
  );
}
