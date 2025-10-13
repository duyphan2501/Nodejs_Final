import CustomTableCategoryBag from "./CustomTableCategoryBag";
import CustomTableCategorySandal from "./CustomTableCategorySandal";
import CustomTableCategoryShoe from "./CustomTableCategoryShoe";
import CustomTableOrder from "./CustomTableOrder";
import CustomTableOrderDetail from "./CustomTableOrderDetail";

const CustomTable = ({ type }) => {
  return (
    <>
      {type === "order" && <CustomTableOrder />}
      {type === "order-detail" && <CustomTableOrderDetail />}
      {type === "category-shoe" && <CustomTableCategoryShoe />}
      {type === "category-sandal" && <CustomTableCategorySandal />}
      {type === "category-bag" && <CustomTableCategoryBag />}
    </>
  );
};

export default CustomTable;
