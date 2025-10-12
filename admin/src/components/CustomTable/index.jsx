import CustomTableCategoryShoe from "./CustomTableCategoryShoe";
import CustomTableOrder from "./CustomTableOrder";
import CustomTableOrderDetail from "./CustomTableOrderDetail";

const CustomTable = ({ type }) => {
  return (
    <>
      {type === "order" && <CustomTableOrder />}
      {type === "order-detail" && <CustomTableOrderDetail />}
      {type === "category-shoe" && <CustomTableCategoryShoe />}
    </>
  );
};

export default CustomTable;
