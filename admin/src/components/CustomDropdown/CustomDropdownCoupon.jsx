import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownCoupon({ choose, handleChangeInput }) {
  const statusColors = {
    active: "#C8E6C9", // Hiệu lực
    inactive: "#FFCDD2", // Không hiệu lực
  };

  return (
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
        value={choose}
        onChange={(e) => handleChangeInput("status", e.target.value)}
        sx={{
          height: 36,
          borderRadius: "12px",
          fontWeight: 500,
          backgroundColor: statusColors[choose] || "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <MenuItem value="active">Hiệu lực </MenuItem>
        <MenuItem value="inactive">Không hiệu lực </MenuItem>
      </Select>
    </FormControl>
  );
}
