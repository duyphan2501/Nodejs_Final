import { createContext, useState } from "react";

const MyContext = createContext();

const ContextProvider = ({ children }) => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const value = {
    persist,
    setPersist,
  };
  return <MyContext.Provider value={value}> {children}</MyContext.Provider>;
};

export { ContextProvider, MyContext };
