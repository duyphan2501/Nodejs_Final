import TableControlCategory from "./TableControlCategory";
import { TableControlOrder } from "./TableControlOrder";

const TableControl = ({ type }) => {
  return (
    <>
      {type === "order" && <TableControlOrder />}
      {type === "category" && <TableControlCategory />}
    </>
  );
};

export default TableControl;
