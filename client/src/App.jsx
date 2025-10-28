import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AccountMenu from "./layouts/Header/Navbar/AccountMenu";
import { useContext } from "react";
import { MyContext } from "./Context/MyContext";
import Layouts from "./layouts";
import Cart from "./pages/Cart";
import CartWithItems from "./components/CartWithItems";
import MyAccount from "./pages/MyAccount";

import Home from "./pages/Landing/Home";
import QuickViewDialog from "./components/QuickViewDialog";
import ProductPage from "./pages/Products/ProductPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
function App() {
  const { isOpenAccountMenu, setIsOpenAccountMenu, selectedProduct } = useContext(MyContext);

  const handleAccountMenuClose = () => {
    setIsOpenAccountMenu(false);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<Login />} />
          <Route path={"/sign-up"} element={<Signup />} />
          <Route path="/" element={<Layouts />}>
            <Route path="cart" element={<Cart />} />
            <Route path="my-account" element={<MyAccount />} />
          </Route>
          <Route path="*" element={<Layouts />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products" element={<ProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={3000}
        pauseOnHover={true}
        position="top-center"
      />
      {selectedProduct && <QuickViewDialog />}

      {/* Account Menu - Controlled by Context */}
      {isOpenAccountMenu && <AccountMenu onClose={handleAccountMenuClose} />}
    </>
  );
}

export default App;
