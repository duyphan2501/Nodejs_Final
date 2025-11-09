import { useState } from "react";
import {
  ListItem,
  Collapse,
  List,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { CgAdd, CgRemove } from "react-icons/cg";
// Nếu bạn dùng icons từ @mui/icons-material thì import ở đây

// Component đệ quy để hiển thị một danh mục đơn
const CategoryItem = ({ category, handleChange }) => {
  const [open, setOpen] = useState(false);
  // ... (các state khác nếu có)

  const handleClick = () => {
    if (category.children && category.children.length > 0) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem
        // *** ĐIỀU CHỈNH QUAN TRỌNG Ở ĐÂY ***
        // Giảm padding top và bottom xuống 0px (hoặc 4px tùy ý)
        sx={{
          paddingTop: "0px",
          paddingBottom: "0px",
          // Thụt lề dựa trên level
          paddingLeft: `${(category.level || 0) * 20}px`,
        }}
      >
        <div
         className="flex justify-between items-center w-full"
        >
          {/* Checkbox và Label */}
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => handleChange(e, "categoryId", category._id)}
                sx={{
                  color: "black",
                  "&.Mui-checked": { color: "black" },
                  "&:hover": { backgroundColor: "rgba(0, 43, 91, 0.08)" },
                  // Có thể giảm kích thước icon checkbox nếu cần
                  // padding: '4px', // Giảm padding bên trong checkbox
                }}
              />
            }
            label={category.name}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Icon Mở Rộng */}
          {category.children && category.children.length > 0 ? (
            <IconButton onClick={handleClick} size="small">
              {open ? <CgRemove /> : <CgAdd />}
            </IconButton>
          ) : (
            <div style={{ width: "40px" }} />
          )}
        </div>
      </ListItem>

      {/* Collapse (Phần ẩn/hiện danh mục con) */}
      {category.children && category.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.children.map((subCategory) => (
              <CategoryItem
                key={subCategory._id}
                category={{
                  ...subCategory,
                  level: (category.level || 0) + 1,
                }}
                handleChange={handleChange}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CategoryItem;
