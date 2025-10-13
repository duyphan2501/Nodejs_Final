import TableControlCategory from "./TableControlCategory";
import { TableControlOrder } from "./TableControlOrder";

const TableControl = ({ type, setConfirmDelete }) => {
  return (
    <>
      {type === "order" && <TableControlOrder />}
      {type === "category" && (
        <TableControlCategory setConfirmDelete={setConfirmDelete} />
      )}
    </>
  );
};

export default TableControl;
