import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownUser({ choose }) {
  const [status, setStatus] = useState(choose);

  const statusColors = {
    active: "#C8E6C9",
    inactive: "#FFCDD2",
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
        <MenuItem value="active">Hoạt Động</MenuItem>
        <MenuItem value="inactive">Không Hoạt Động</MenuItem>
      </Select>
    </FormControl>
  );
}
