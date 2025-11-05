import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import { Button, Popover } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTableControl } from "./TableControllerContext";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const TableControlUser = () => {
  const [anchorAll, setAnchorAll] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const { filter, setFilter } = useTableControl();

  // Local state cho search input - đồng bộ với filter.search
  const [searchInput, setSearchInput] = useState(filter.search || "");
  const searchTimeoutRef = useRef(null);

  // Đồng bộ searchInput với filter.search khi filter thay đổi từ bên ngoài
  useEffect(() => {
    setSearchInput(filter.search || "");
  }, [filter.search]);

  // Debounce search với 500ms
  useEffect(() => {
    // Bỏ qua nếu searchInput === filter.search (đã đồng bộ)
    if (searchInput === filter.search) {
      return;
    }

    // Clear timeout cũ
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set timeout mới
    searchTimeoutRef.current = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        search: searchInput,
      }));
    }, 500);

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]); // Chỉ phụ thuộc vào searchInput

  const handleChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap gap-4">
        <div className="relative w-100">
          <input
            type="text"
            className="rounded-full p-2 pl-10 w-full h-full shadow"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
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
          ></Menu>
        </div>

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
            <div className="p-4 w-50">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Lọc theo trạng thái
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={filter.status}
                  name="radio-buttons-group"
                  onChange={(e) => {
                    handleChange("status", e.target.value);
                  }}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="Tất cả"
                  />
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </Popover>
        </div>
      </div>

      {/* Divider  */}
      <div className="h-px bg-gray-300 w-full mt-5"></div>

      {/* Selection Group  */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>
  );
};

export { TableControlUser };
