import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const AttributeMenu = ({ attributes, selectedAttr, setSelectedAttr }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelectItem = (value) => {
    try {
      setSelectedAttr(value);
    } catch (error) {
      console.error("Failed to selecte:", error);
    }
    setAnchorEl(null);
  };

  return (
    <div className="w-fit">
      <div className=" flex justify-center items-center ">
        <button onClick={handleClick} className="cursor-pointer px-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800">
          <span className="italic">Size: </span>
          {selectedAttr.size}
        </button>
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        onChange={setSelectedAttr}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {attributes &&
          attributes.map((attr, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSelectItem(attr)}
              className="!text-sm"
            >
              {attr.size}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default AttributeMenu;
