import CustomModalCategory from "./CustomModalCategory";
import CustomModalOrder from "./CustomModalOrder";
import CustomModalUser from "./CustomModalUser";

export default function CustomModal({ type, controlEditModal }) {
  return (
    <>
      {type === "order" && <CustomModalOrder />}
      {type === "category" && (
        <CustomModalCategory controlEditModal={controlEditModal} />
      )}
      {type === "users" && <CustomModalUser />}
    </>
  );
}
