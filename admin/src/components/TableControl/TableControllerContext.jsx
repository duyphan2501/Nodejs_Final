import { createContext, useContext, useState } from "react";

const TableControlContext = createContext();

const TableControlProvider = ({
  children,
  controlConfirmDelete,
  controlSelectAll,
  orderData,
  userData,
  couponData,
  filter,
  setFilter,
  controlSelectDetail,
  selectedCouponId,
  setSelectedCouponId,
}) => {
  const { confirmDelete, setConfirmDelete } = controlConfirmDelete;
  const { selectedItem, setSelectedItem } = controlSelectAll;
  const { selectedDetail, setSelectedDetail } = controlSelectDetail;

  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <TableControlContext.Provider
      value={{
        confirmDelete,
        setConfirmDelete,
        orderData,
        filter,
        setFilter,
        selectedItem,
        setSelectedItem,
        selectedDetail,
        setSelectedDetail,
        userData,
        couponData,
        selectedCouponId,
        setSelectedCouponId,
        selectedUserId,
        setSelectedUserId,
      }}
    >
      {children}
    </TableControlContext.Provider>
  );
};

const useTableControl = () => useContext(TableControlContext);

export { TableControlProvider, useTableControl };
