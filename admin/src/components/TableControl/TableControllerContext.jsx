import { createContext, useContext } from "react";

const TableControlContext = createContext();

const TableControlProvider = ({
  children,
  sort,
  setSort,
  filter,
  setFilter,
}) => {
  return (
    <TableControlContext.Provider value={{ sort, setSort, filter, setFilter }}>
      {children}
    </TableControlContext.Provider>
  );
};

const useTableControl = () => {
  return useContext(TableControlContext);
};

export { TableControlProvider, useTableControl };
