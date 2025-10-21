import TableControlCategory from "./TableControlCategory";
import { TableControlOrder } from "./TableControlOrder";
import { TableControlUser } from "./TableControlUser";

const TableControl = ({ type, setConfirmDelete }) => {
  return (
    <>
      {type === "order" && <TableControlOrder />}
      {type === "category" && (
        <TableControlCategory setConfirmDelete={setConfirmDelete} />
      )}
      {type === "user" && <TableControlUser />}
    </>
  );
};

export default TableControl;
