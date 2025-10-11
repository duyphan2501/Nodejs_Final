import CustomModalOrder from "./CustomModalOrder";

export default function CustomModal({ type }) {
  return <>{type === "order" && <CustomModalOrder />}</>;
}
