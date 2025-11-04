import { useState } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function CustomDropdownCouponType({
  choose,
  handleChangeInput,
}) {
  const [status, setStatus] = useState(choose);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setStatus(newValue);

    // Gọi callback để update form cha
    if (handleChangeInput) {
      handleChangeInput("discountType", newValue);
    }
  };

  return (
    <FormControl
      sx={{
        minWidth: "100%",
        width: {
          xs: "100%",
          sm: "50%",
        },
        marginTop: "8px",
      }}
    >
      <Select
        value={status}
        onChange={handleChange}
        sx={{
          height: 36,
          borderRadius: "12px",
          fontWeight: 500,
        }}
      >
        <MenuItem value="percent">Phần Trăm</MenuItem>
        <MenuItem value="fixed">Cố Định</MenuItem>
      </Select>
    </FormControl>
  );
}
