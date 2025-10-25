import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownCouponType({ choose }) {
  const [status, setStatus] = useState(choose);

  return (
    <FormControl
      sx={{
        minWidth: "100%",
        width: {
          xs: "100%", // màn nhỏ
          sm: "50%", // màn sm trở lên
        },
        marginTop: "8px",
      }}
    >
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{
          height: 36,
          borderRadius: "12px",
          fontWeight: 500,
        }}
      >
        <MenuItem value="percentage">Phần Trăm</MenuItem>
        <MenuItem value="fixed">Cố Định</MenuItem>
      </Select>
    </FormControl>
  );
}
