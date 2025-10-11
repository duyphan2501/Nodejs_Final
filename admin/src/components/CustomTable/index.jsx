import CustomTableOrder from "./CustomTableOrder";
import CustomTableOrderDetail from "./CustomTableOrderDetail";

const CustomTable = ({ type }) => {
  return (
    <>
      {type === "order" && <CustomTableOrder />}
      {type === "order-detail" && <CustomTableOrderDetail />}
    </>
  );
};

export default CustomTable;
