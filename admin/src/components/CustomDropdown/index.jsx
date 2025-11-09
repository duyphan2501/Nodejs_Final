import CustomDropdownUser from "./CustomDropdownUser";
import CustomDropdownOrder from "./CustomDropdownOrder";
import CustomDropdownCoupon from "./CustomDropdownCoupon";
import CustomDropdownCouponEdit from "./CustomDropdownCouponType";

const CustomDropdown = ({ type, choose, handleChangeInput, id }) => {
  return (
    <>
      {type === "order" && <CustomDropdownOrder choose={choose} id={id} />}
      {type === "user" && <CustomDropdownUser choose={choose} />}
      {type === "coupon" && (
        <CustomDropdownCoupon
          handleChangeInput={handleChangeInput}
          choose={choose}
        />
      )}
      {type === "coupon-edit" && <CustomDropdownCouponEdit choose={choose} />}
    </>
  );
};

export default CustomDropdown;
