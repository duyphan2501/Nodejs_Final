import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import AccountMenu from "./layouts/Header/Navbar/AccountMenu";
import { useContext } from "react";
import { MyContext } from "./Context/MyContext";
import DemoContent from "./components/DemoContent";

function App() {
  const { isOpenAccountMenu, setIsOpenAccountMenu } = useContext(MyContext);

  const handleAccountMenuClose = () => {
    setIsOpenAccountMenu(false);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<Login />} />
          <Route path="/" element={<Layouts />}>
            <Route index element={<DemoContent />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={3000}
        pauseOnHover={true}
        position="top-center"
      />

      {/* Account Menu - Controlled by Context */}
      {isOpenAccountMenu && <AccountMenu onClose={handleAccountMenuClose} />}
    </>
  );
}

export default App;
