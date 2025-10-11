import CustomDropdownOrder from "./CustomDropdownOrder";

const CustomDropdown = ({ type, choose }) => {
  return <>{type === "order" && <CustomDropdownOrder choose={choose} />}</>;
};

export default CustomDropdown;
