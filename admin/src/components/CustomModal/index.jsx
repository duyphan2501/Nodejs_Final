import CustomModalCategory from "./CustomModalCategory";
import CustomModalOrder from "./CustomModalOrder";
import CustomModalUser from "./CustomModalUser";
import CustomModalCouponEdit from "./CustomModalCouponEdit";
import CustomModalCouponAdd from "./CustomModalCouponAdd";
import CustomModalAddCategory from "./CustomModalAddCategory";

export default function CustomModal({
  type,
  controlEditModal,
  controlAddCoupon,
  controlAddCategoryModal,
}) {
  return (
    <>
      {type === "order" && <CustomModalOrder />}
      {type === "category" && (
        <CustomModalCategory controlEditModal={controlEditModal} />
      )}
      {type === "category-add" && (
        <CustomModalAddCategory
          controlAddCategoryModal={controlAddCategoryModal}
        />
      )}
      {type === "users" && <CustomModalUser />}
      {type === "coupon-edit" && <CustomModalCouponEdit />}
      {type === "coupon-add" && (
        <CustomModalCouponAdd control={controlAddCoupon} />
      )}
    </>
  );
}
