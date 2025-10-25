const MyTooltip = ({
  label,
  position = "top",
  children,
  hideOnTooltipHover = true,
}) => {
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative flex w-fit group/tooltip`}>
      <div className="w-fit">{children}</div>

      <div
        className={`
          absolute z-50 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-sm text-white
          transition-all duration-200
          ${positions[position] || positions.top}
          ${hideOnTooltipHover ? "pointer-events-none" : ""}
          opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
        `}
      >
        {label}
      </div>
    </div>
  );
};

export default MyTooltip;
