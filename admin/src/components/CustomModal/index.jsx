import CustomModalCategory from "./CustomModalCategory";
import CustomModalOrder from "./CustomModalOrder";
import CustomModalUser from "./CustomModalUser";
import CustomModalCouponEdit from "./CustomModalCouponEdit";

export default function CustomModal({ type, controlEditModal }) {
  return (
    <>
      {type === "order" && <CustomModalOrder />}
      {type === "category" && (
        <CustomModalCategory controlEditModal={controlEditModal} />
      )}
      {type === "users" && <CustomModalUser />}
      {type === "coupon-edit" && <CustomModalCouponEdit />}
    </>
  );
}
