import { createContext, useContext } from "react";

const TableControlContext = createContext();

const TableControlProvider = ({
  children,
  controlConfirmDelete,
  controlSelectAll,
  orderData,
  userData,
  filter,
  setFilter,
  controlSelectDetail,
}) => {
  const { confirmDelete, setConfirmDelete } = controlConfirmDelete;
  const { selectedItem, setSelectedItem } = controlSelectAll;
  const { selectedDetail, setSelectedDetail } = controlSelectDetail;
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
      }}
    >
      {children}
    </TableControlContext.Provider>
  );
};

const useTableControl = () => {
  return useContext(TableControlContext);
};

export { TableControlProvider, useTableControl };
