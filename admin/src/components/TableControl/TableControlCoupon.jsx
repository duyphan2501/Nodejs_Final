import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem, CircularProgress } from "@mui/material";
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
import CustomModal from "../CustomModal";
import useCoupon from "../../../hooks/useCoupon";
import useCouponStore from "../../../stores/useCouponStore";

const TableControlCoupon = () => {
  const [anchorAll, setAnchorAll] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const { confirmDelete, setConfirmDelete } = useTableControl();
  const { filter, setFilter } = useTableControl();
  const { selectedItem, setSelectedItem, couponData } = useTableControl();

  const { deleteManyCoupons, loading } = useCoupon();
  const { coupons } = useCouponStore();

  const [openAddCoupon, setOpenAddCoupon] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Debounce search
  const handleSearchChange = (value) => {
    setSearchInput(value);

    // Debounce để tránh call API liên tục
    const timeoutId = setTimeout(() => {
      handleFilterChange("search", value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Xóa nhiều coupons
  const handleDeleteSelected = async () => {
    setDeleteError(null);

    if (selectedItem.length === 0) {
      setDeleteError("Vui lòng chọn ít nhất 1 coupon để xóa");
      return;
    }

    try {
      // Tìm IDs từ coupon codes
      const couponIds = coupons
        .filter((c) => selectedItem.includes(c.code))
        .map((c) => c._id);

      if (couponIds.length === 0) {
        setDeleteError("Không tìm thấy coupons để xóa");
        return;
      }

      await deleteManyCoupons(couponIds);

      // Clear selection sau khi xóa thành công
      setSelectedItem([]);
      setConfirmDelete(false);

      console.log("✅ Xóa coupons thành công");
    } catch (error) {
      setDeleteError(error.message || "Lỗi khi xóa coupons");
      console.error("❌ Lỗi xóa:", error);
    }
  };

  return (
    <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
      <CustomModal
        type={"coupon-add"}
        controlAddCoupon={{ openAddCoupon, setOpenAddCoupon }}
      />

      {/* Hiển thị lỗi khi xóa */}
      {deleteError && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">
          {deleteError}
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="mb-3 p-4 bg-yellow-50 border border-yellow-200 rounded flex justify-between items-center">
          <div>
            <p className="font-semibold">
              Xác nhận xóa {selectedItem.length} coupon(s)?
            </p>
            <p className="text-sm text-gray-600">
              Hành động này không thể hoàn tác
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={() => setConfirmDelete(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Xóa"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {/* Ô tìm kiếm */}
        <div className="relative w-100">
          <input
            type="text"
            className="rounded-full p-2 pl-10 w-full h-full shadow"
            placeholder="Tìm mã giảm giá..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
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
              onClick={() => {
                setSelectedItem(() => couponData.map((c) => c.couponCode));
                setAnchorAll(null);
              }}
            >
              Chọn tất cả
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedItem([]);
                setAnchorAll(null);
              }}
            >
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
                  value={filter.status || "all"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="Tất cả"
                  />
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Hiệu lực"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio />}
                    label="Vô hiệu lực"
                  />
                </RadioGroup>
              </FormControl>

              <div className="mt-4">
                <FormControl>
                  <FormLabel id="filter-type">Loại giảm giá</FormLabel>
                  <RadioGroup
                    aria-labelledby="filter-type"
                    name="coupon-type"
                    value={filter.discountType || "all"}
                    onChange={(e) =>
                      handleFilterChange("discountType", e.target.value)
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

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFilter({});
                    setAnchorFilter(null);
                  }}
                >
                  Xóa bộ lọc
                </Button>
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
            disabled={selectedItem.length === 0 || loading}
          >
            <DeleteIcon />
            {selectedItem.length > 0 && (
              <span className="ml-2">{selectedItem.length}</span>
            )}
          </Button>
        </div>

        {/* Nút thêm mới */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Button
            variant="contained"
            sx={{
              borderRadius: "100px",
              background: "#00C950",
              textTransform: "none",
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenAddCoupon(true)}
          >
            Thêm Mã Giảm Giá
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 w-full mt-5"></div>

      {/* Hiển thị filter đang áp dụng */}
      {(filter.search || filter.status || filter.discountType) && (
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Đang lọc:</span>
          {filter.search && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Tìm kiếm: "{filter.search}"
            </span>
          )}
          {filter.status && filter.status !== "all" && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Trạng thái:{" "}
              {filter.status === "active" ? "Hiệu lực" : "Vô hiệu lực"}
            </span>
          )}
          {filter.discountType && filter.discountType !== "all" && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Loại:{" "}
              {filter.discountType === "percentage" ? "Phần trăm" : "Giá tiền"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export { TableControlCoupon };
