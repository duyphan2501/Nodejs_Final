import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CategoryPicker({ dataCategory }) {
  // Khởi tạo state: { [id]: boolean }
  const [checked, setChecked] = React.useState({});

  // Toggle 1 node
  const handleToggle =
    (id, children = []) =>
    (event) => {
      const isChecked = event.target.checked;
      setChecked((prev) => {
        const newChecked = { ...prev, [id]: isChecked };
        // Nếu là cha → update tất cả con
        children.forEach((child) => {
          newChecked[child.id] = isChecked;
        });
        return newChecked;
      });
    };

  // Kiểm tra trạng thái cha (all / none / some)
  const getParentState = (children) => {
    const values = children.map((c) => checked[c.id]);
    const allChecked = values.every(Boolean);
    const noneChecked = values.every((v) => !v);
    return {
      checked: allChecked,
      indeterminate: !allChecked && !noneChecked,
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {dataCategory.map((parent) => {
        const { checked: isChecked, indeterminate } = getParentState(
          parent.children
        );
        return (
          <Box key={parent.id}>
            {/* Checkbox cha */}
            <FormControlLabel
              label={parent.label}
              control={
                <Checkbox
                  checked={isChecked}
                  indeterminate={indeterminate}
                  onChange={handleToggle(parent.id, parent.children)}
                />
              }
            />

            {/* Checkbox con */}
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              {parent.children.map((child) => (
                <FormControlLabel
                  key={child.id}
                  label={child.label}
                  control={
                    <Checkbox
                      checked={!!checked[child.id]}
                      onChange={handleToggle(child.id)}
                    />
                  }
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
