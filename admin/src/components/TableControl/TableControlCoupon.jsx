import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import { Button, Popover } from "@mui/material";
import { useState } from "react";
import { useTableControl } from "./TableControllerContext";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const TableControlCoupon = () => {
  const [anchorAll, setAnchorAll] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [anchorCustomizeDate, setAnchorCustomizeDate] = useState(false);

  const { confirmDelete, setConfirmDelete } = useTableControl();
  const { filter, setFilter } = useTableControl();
  const { setSelectedItem, couponData } = useTableControl();

  const handleChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap gap-4">
        {/* Ô tìm kiếm */}
        <div className="relative w-100">
          <input
            type="text"
            className="rounded-full p-2 pl-10 w-full h-full shadow"
            placeholder="Tìm mã giảm giá..."
            onChange={(e) => handleChange("search", e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Menu chọn tất cả / bỏ chọn */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Button
            color="black"
            sx={{
              background: "#F3F3F3",
              borderRadius: "100px",
            }}
            padding="20"
            onClick={(event) => setAnchorAll(event.currentTarget)}
          >
            <MoreHorizIcon />
          </Button>
          <Menu
            id="all-button"
            aria-labelledby="all-button"
            anchorEl={anchorAll}
            open={Boolean(anchorAll)}
            onClose={() => setAnchorAll(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem
              onClick={() =>
                setSelectedItem(() => couponData.map((c) => c.couponCode))
              }
            >
              Chọn tất cả
            </MenuItem>
            <MenuItem onClick={() => setSelectedItem([])}>
              Bỏ chọn tất cả
            </MenuItem>
          </Menu>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Button
            color="black"
            sx={{
              background: "#F3F3F3",
              borderRadius: "100px",
            }}
            padding="20"
            onClick={(event) => setAnchorFilter(event.currentTarget)}
          >
            <FilterListIcon />
          </Button>
          <Popover
            id={"filter-popover"}
            open={Boolean(anchorFilter)}
            anchorEl={anchorFilter}
            onClose={() => setAnchorFilter(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="p-4 w-60">
              <FormControl>
                <FormLabel id="filter-status">Lọc theo trạng thái</FormLabel>
                <RadioGroup
                  aria-labelledby="filter-status"
                  name="coupon-status"
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="Tất cả"
                  />
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Đang hoạt động"
                  />
                  <FormControlLabel
                    value="expired"
                    control={<Radio />}
                    label="Đã hết hạn"
                  />
                  <FormControlLabel
                    value="upcoming"
                    control={<Radio />}
                    label="Chưa bắt đầu"
                  />
                </RadioGroup>
              </FormControl>

              <div className="mt-4">
                <FormControl>
                  <FormLabel id="filter-type">Loại giảm giá</FormLabel>
                  <RadioGroup
                    aria-labelledby="filter-type"
                    name="coupon-type"
                    onChange={(e) =>
                      handleChange("discountType", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="Tất cả"
                    />
                    <FormControlLabel
                      value="percentage"
                      control={<Radio />}
                      label="Theo phần trăm"
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio />}
                      label="Theo giá tiền"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </Popover>
        </div>

        {/* Nút xóa */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Button
            color="white"
            sx={{
              background: "red",
              borderRadius: "100px",
              color: "#F3F3F3",
            }}
            padding="20"
            onClick={() => setConfirmDelete(true)}
          >
            <DeleteIcon />
          </Button>
        </div>

        {/* Nút thêm mới */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "100px",
              background: "#1976d2",
              textTransform: "none",
            }}
            startIcon={<AddIcon />}
            onClick={() => alert("Hiển thị modal thêm coupon")}
          >
            Thêm Mã Giảm Giá
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 w-full mt-5"></div>

      {/* Khu vực filter mở rộng (nếu có sau này) */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>
  );
};

export { TableControlCoupon };
