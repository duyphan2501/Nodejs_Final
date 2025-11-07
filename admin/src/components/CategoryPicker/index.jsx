import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CategoryPicker({
  dataCategory,
  handleChangeInput,
  reset,
  initialData,
}) {
  // Khởi tạo state: { [id]: boolean }
  // React.useEffect((isEdit) => {
  //   if(isEdit)
  // })

  const [checked, setChecked] = React.useState({});

  React.useEffect(() => {
    if (
      initialData &&
      JSON.stringify(initialData) !== JSON.stringify(checked)
    ) {
      setChecked(initialData);
    }
  }, [initialData]);

  React.useEffect(() => {
    const keysToDelete = ["1", "2", "3"];

    const newObj = Object.entries(checked)
      .filter(([key, value]) => !keysToDelete.includes(key) && value === true)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    handleChangeInput("categoryId", newObj);
  }, [checked]);

  React.useEffect(() => {
    setChecked({});
  }, [reset]);

  // Toggle 1 node
  const handleToggle =
    (_id, children = []) =>
    (event) => {
      const isChecked = event.target.checked;
      setChecked((prev) => {
        const newChecked = { ...prev, [_id]: isChecked };
        // Nếu là cha → update tất cả con
        children.forEach((child) => {
          newChecked[child._id] = isChecked;
        });
        return newChecked;
      });
    };

  // Kiểm tra trạng thái cha (all / none / some)
  const getParentState = (children) => {
    const values = children.map((c) => checked[c._id]);
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
          <Box key={parent._id}>
            {/* Checkbox cha */}
            <FormControlLabel
              label={parent.name}
              control={
                <Checkbox
                  checked={isChecked}
                  indeterminate={indeterminate}
                  onChange={handleToggle(parent._id, parent.children)}
                />
              }
            />

            {/* Checkbox con */}
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              {parent.children.map((child) => (
                <FormControlLabel
                  key={child._id}
                  label={child.name}
                  control={
                    <Checkbox
                      checked={!!checked[child._id]}
                      onChange={handleToggle(child._id)}
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
