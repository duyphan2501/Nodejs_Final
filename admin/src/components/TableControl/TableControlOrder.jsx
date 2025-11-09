import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import { Button, Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { useTableControl } from "./TableControllerContext";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import useOrderStore from "../../../stores/useOrderStore";

const TableControlOrder = () => {
  const orders = useOrderStore((s) => s.orders);
  const originalOrders = useOrderStore((s) => s.originalOrders);
  const setOrders = useOrderStore((s) => s.setOrders);

  const [anchorAll, setAnchorAll] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [anchorCustomizeDate, setAnchorCustomizeDate] = useState(false);
  const { confirmDelete, setConfirmDelete } = useTableControl();
  const [filter, setFilter] = useState({});
  const { setSelectedItem } = useTableControl();

  const handleChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = () => {
    const filtered = originalOrders.filter((order) => {
      const matchSearch =
        !filter.search ||
        order.customerName
          ?.toLowerCase()
          .includes(filter.search.toLowerCase()) ||
        order.orderCode
          ?.toString()
          .toLowerCase()
          .includes(filter.search.toLowerCase());

      const orderDate = new Date(order.createdAt);
      const today = new Date();
      let matchDate = true;

      if (filter.range === "today") {
        matchDate = orderDate.toDateString() === today.toDateString();
      } else if (filter.range === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        matchDate = orderDate.toDateString() === yesterday.toDateString();
      } else if (filter.range === "thisWeek") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        matchDate = orderDate >= startOfWeek && orderDate <= today;
      } else if (filter.range === "thisMonth") {
        matchDate =
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear();
      } else if (filter.range === "customize" && filter.from && filter.to) {
        const fromDate = new Date(filter.from);
        const toDate = new Date(filter.to);
        matchDate = orderDate >= fromDate && orderDate <= toDate;
      }

      return matchSearch && matchDate;
    });

    setOrders(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filter]);

  return (
    <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap gap-4">
        <div className="relative w-100">
          <input
            type="text"
            className="rounded-full p-2 pl-10 w-full h-full shadow"
            placeholder="Searching"
            onChange={(e) => handleChange("search", e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

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
              onClick={() => setSelectedItem(() => orders.map((o) => o._id))}
            >
              Chọn tất cả
            </MenuItem>
            <MenuItem onClick={() => setSelectedItem([])}>Xóa tất cả</MenuItem>
          </Menu>
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
            <div className="p-4 w-100">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Lọc theo thời gian
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={filter?.range || ""}
                  defaultValue="female"
                  name="radio-buttons-group"
                  onChange={(e) => {
                    setAnchorCustomizeDate(e.target.value === "customize");
                    handleChange("range", e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="today"
                    control={<Radio />}
                    label="Hôm nay"
                  />
                  <FormControlLabel
                    value="yesterday"
                    control={<Radio />}
                    label="Hôm qua"
                  />
                  <FormControlLabel
                    value="thisWeek"
                    control={<Radio />}
                    label="Tuần này"
                  />
                  <FormControlLabel
                    value="thisMonth"
                    control={<Radio />}
                    label="Tháng này"
                  />
                  <FormControlLabel
                    value="customize"
                    control={<Radio />}
                    label="Tùy chỉnh"
                  />
                </RadioGroup>
              </FormControl>
              {anchorCustomizeDate && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="dateFrom">Từ ngày:</label>
                  <input
                    id="dateFrom"
                    type="date"
                    className="border p-2 rounded-md"
                    value={filter?.from || ""}
                    onChange={(e) => handleChange("from", e.target.value)}
                  />
                  <label htmlFor="dateTo">Đến ngày:</label>
                  <input
                    id="dateTo"
                    type="date"
                    value={filter?.to || ""}
                    className="border p-2 rounded-md"
                    onChange={(e) => handleChange("to", e.target.value)}
                  />
                </div>
              )}
            </div>
          </Popover>
        </div>

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
      </div>

      {/* Divider  */}
      <div className="h-px bg-gray-300 w-full mt-5"></div>

      {/* Selection Group  */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>
  );
};

export { TableControlOrder };
