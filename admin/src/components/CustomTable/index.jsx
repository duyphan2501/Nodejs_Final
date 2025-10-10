import CustomTableOrder from "./CustomTableOrder";

const CustomTable = ({ type }) => {
  return <>{type === "order" && <CustomTableOrder />}</>;
};

export default CustomTable;
