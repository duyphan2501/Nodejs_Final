import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
  const [isOpenAccountMenu, setIsOpenAccountMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  const [verifyUser, setVerifyUser] = useState(null);
  
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);  
  const openAddrFrm = () => setIsOpenAddressForm(true);
  const closeAddrFrm = () => setIsOpenAddressForm(false);
  const [updateAddr, setUpdateAddr] = useState(null)

  const values = {
    isOpenAccountMenu,
    setIsOpenAccountMenu,
    selectedProduct,
    setSelectedProduct,
    cartItems,
    setCartItems,
    persist,
    setPersist,
    isOpenAddressForm,
    setIsOpenAddressForm,
    verifyUser,
    setVerifyUser,
    openAddrFrm,
    closeAddrFrm,
    updateAddr,
    setUpdateAddr
  };
  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export { ContextProvider, MyContext };
