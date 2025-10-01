import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
    const [isOpenAccountMenu, setIsOpenAccountMenu] = useState(false);
    const values = {isOpenAccountMenu, setIsOpenAccountMenu};
    return <MyContext.Provider value={values}>
        {children}  
    </MyContext.Provider>
};

export {ContextProvider, MyContext}
