import TableControlCategory from "./TableControlCategory";
import { TableControlOrder } from "./TableControlOrder";
import { TableControlUser } from "./TableControlUser";
import { TableControlCoupon } from "./TableControlCoupon";

const TableControl = ({ type, setConfirmDelete }) => {
  return (
    <>
      {type === "order" && <TableControlOrder />}
      {type === "category" && (
        <TableControlCategory setConfirmDelete={setConfirmDelete} />
      )}
      {type === "user" && <TableControlUser />}
      {type === "coupon" && <TableControlCoupon />}
    </>
  );
};

export default TableControl;
