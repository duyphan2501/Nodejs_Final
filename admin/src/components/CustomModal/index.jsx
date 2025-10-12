import CustomModalCategory from "./CustomModalCategory";
import CustomModalOrder from "./CustomModalOrder";

export default function CustomModal({ type, controlEditModal }) {
  return (
    <>
      {type === "order" && <CustomModalOrder />}
      {type === "category" && (
        <CustomModalCategory controlEditModal={controlEditModal} />
      )}
    </>
  );
}
