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
import useCategoryStore from "../../../stores/useCategoryStore";

export default function TableControlCategory({
  setConfirmDelete,
  selectedItem,
}) {
  const { setSearchTerm } = useCategoryStore();

  return (
    <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap gap-4">
        <div className="relative w-100">
          <input
            type="text"
            className="rounded-full p-2 pl-10 w-full h-full shadow"
            placeholder="Searching"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap md:flex-nowrap">
          {selectedItem.length === 0 ? (
            ""
          ) : (
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
          )}
        </div>
      </div>

      {/* Divider  */}
      <div className="h-px bg-gray-300 w-full mt-5"></div>

      {/* Selection Group  */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>
  );
}
