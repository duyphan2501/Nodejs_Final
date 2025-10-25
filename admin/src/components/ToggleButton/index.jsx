import React, { useState } from "react";

const ToggleButton = ({ isEnable = false }) => {
  const [enabled, setEnabled] = useState(isEnable);

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
};

export default ToggleButton;
