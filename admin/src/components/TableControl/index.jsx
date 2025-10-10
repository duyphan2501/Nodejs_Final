import { TableControlOrder } from "./TableControlOrder";

const TableControl = ({ type }) => {
  return <>{type === "order" && <TableControlOrder />}</>;
};

export default TableControl;
