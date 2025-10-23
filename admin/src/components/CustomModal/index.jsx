import CustomModalCategory from "./CustomModalCategory";
import CustomModalOrder from "./CustomModalOrder";
import CustomModalUser from "./CustomModalUser";
import CustomModalCouponEdit from "./CustomModalCouponEdit";
import CustomModalCouponAdd from "./CustomModalCouponAdd";

export default function CustomModal({
  type,
  controlEditModal,
  controlAddCoupon,
}) {
  return (
    <>
      {type === "order" && <CustomModalOrder />}
      {type === "category" && (
        <CustomModalCategory controlEditModal={controlEditModal} />
      )}
      {type === "users" && <CustomModalUser />}
      {type === "coupon-edit" && <CustomModalCouponEdit />}
      {type === "coupon-add" && (
        <CustomModalCouponAdd control={controlAddCoupon} />
      )}
    </>
  );
}
