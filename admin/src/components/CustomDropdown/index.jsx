import CustomDropdownUser from "./CustomDropdownUser";
import CustomDropdownOrder from "./CustomDropdownOrder";
import CustomDropdownCoupon from "./CustomDropdownCoupon";
import CustomDropdownCouponEdit from "./CustomDropdownCouponType";

const CustomDropdown = ({ type, choose }) => {
  return (
    <>
      {type === "order" && <CustomDropdownOrder choose={choose} />}
      {type === "user" && <CustomDropdownUser choose={choose} />}
      {type === "coupon" && <CustomDropdownCoupon choose={choose} />}
      {type === "coupon-edit" && <CustomDropdownCouponEdit choose={choose} />}
    </>
  );
};

export default CustomDropdown;
