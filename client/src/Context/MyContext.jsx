import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
    const [isOpenAccountMenu, setIsOpenAccountMenu] = useState(false);
     const [cartItems, setCartItems] = useState([]);  
    const values = {isOpenAccountMenu, setIsOpenAccountMenu, cartItems, setCartItems};
    return <MyContext.Provider value={values}>
        {children}  
    </MyContext.Provider>
};

export {ContextProvider, MyContext}
