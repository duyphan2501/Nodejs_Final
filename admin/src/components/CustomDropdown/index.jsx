import CustomDropdownUser from "./CustomDropdownUser";
import CustomDropdownOrder from "./CustomDropdownOrder";

const CustomDropdown = ({ type, choose }) => {
  return (
    <>
      {type === "order" && <CustomDropdownOrder choose={choose} />}
      {type === "user" && <CustomDropdownUser choose={choose} />}
    </>
  );
};

export default CustomDropdown;
