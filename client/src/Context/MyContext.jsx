import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
    const values = {};

    return <MyContext.Provider value={values}>
        {children}
    </MyContext.Provider>
};

export {ContextProvider, MyContext}
