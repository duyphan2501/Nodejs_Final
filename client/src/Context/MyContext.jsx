import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
    const [isOpenAccountMenu, setIsOpenAccountMenu] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null)
    const values = {isOpenAccountMenu, setIsOpenAccountMenu, selectedProduct, setSelectedProduct};
    return <MyContext.Provider value={values}>
        {children}  
    </MyContext.Provider>
};

export {ContextProvider, MyContext}
