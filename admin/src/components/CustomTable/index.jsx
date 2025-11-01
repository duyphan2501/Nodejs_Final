import CustomTableCategoryBag from "./CustomTableCategoryBag";
import CustomTableCategorySandal from "./CustomTableCategorySandal";
import CustomTableCategoryShoe from "./CustomTableCategoryShoe";
import CustomTableOrder from "./CustomTableOrder";
import CustomTableOrderDetail from "./CustomTableOrderDetail";
import CustomTableUser from "./CustomTableUser";
import CustomTableCoupon from "./CustomTableCoupon";

const CustomTable = ({ type, selectedItem, setSelectedItem }) => {
  return (
    <>
      {type === "order" && <CustomTableOrder />}
      {type === "order-detail" && <CustomTableOrderDetail />}
      {type === "category-shoe" && (
        <CustomTableCategoryShoe
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
      {type === "category-sandal" && (
        <CustomTableCategorySandal
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
      {type === "category-bag" && (
        <CustomTableCategoryBag
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
      {type === "user" && <CustomTableUser />}
      {type === "coupon" && <CustomTableCoupon />}
    </>
  );
};

export default CustomTable;
