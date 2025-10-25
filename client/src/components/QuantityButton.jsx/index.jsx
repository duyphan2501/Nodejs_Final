import IconButton from "@mui/material/IconButton";
import { Minus, Plus } from "lucide-react";

const QuantityButton = ({ value = 1, onChange }) => {
  const handleDecrease = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between h-10 rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm">
      <IconButton
        size="small"
        onClick={handleDecrease}
        className="!rounded-none hover:!bg-gray-100 transition-colors"
      >
        <Minus className="w-4 h-4 text-gray-700" />
      </IconButton>

      <input
        type="text"
        readOnly
        value={value}
        className="w-10 text-center text-sm font-medium text-gray-800 bg-transparent border-0 focus:outline-none select-none"
      />

      <IconButton
        size="small"
        onClick={handleIncrease}
        className="!rounded-none hover:!bg-gray-100 transition-colors"
      >
        <Plus className="w-4 h-4 text-gray-700" />
      </IconButton>
    </div>
  );
};

export default QuantityButton;
