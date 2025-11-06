import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AccountMenu from "./layouts/Header/Navbar/AccountMenu";
import { useContext, useEffect } from "react";
import { MyContext } from "./Context/MyContext";
import Layouts from "./layouts";
import Cart from "./pages/Cart";
import MyAccount from "./pages/MyAccount";
import Home from "./pages/Landing/Home";
import Address from "./pages/Addresses";
import QuickViewDialog from "./components/QuickViewDialog";
import ProductPage from "./pages/Products/ProductPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Verification from "./pages/Auth/Verification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import AuthLayout from "./layouts/AuthLayout";

import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import OrderList from "./pages/OrderList";

import useUserStore from "./store/useUserStore";
import useCartStore from "./store/useCartStore";
import Checkout from "./pages/Checkout";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import useAddressStore from "./store/useAddressStore";
import AddressForm from "./components/Address/AddressForm";
import ProductDetail from "./pages/Products/ProductDetail";

function App() {
  const { isOpenAccountMenu, setIsOpenAccountMenu, selectedProduct, isOpenAddressForm } =
    useContext(MyContext);

  const axiosPrivate = useAxiosPrivate();

  const user = useUserStore((state) => state.user);
  const getCart = useCartStore((state) => state.getCart);
  const getAllAddresses = useAddressStore(state => state.getAllAddresses)

  useEffect(() => {
    getCart(user?._id);
  }, [user, getCart]);

  const handleAccountMenuClose = () => {
    setIsOpenAccountMenu(false);
  };

  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      try {
        await getAllAddresses(axiosPrivate);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = isOpenAddressForm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpenAddressForm]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path={"/login"} element={<Login />} />
            <Route path={"/sign-up"} element={<Signup />} />
            <Route path={"/verify-account"} element={<Verification />} />
            <Route path={"/forgot-password"} element={<ForgotPassword />} />
            <Route
              path={"/reset-password/:token"}
              element={<ResetPassword />}
            />
          </Route>
          <Route path="/" element={<Layouts />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="order/ORD-2024-002" element={<OrderTracking />} />
            <Route path="order" element={<OrderList />} />
            <Route path="addresses" element={<Address />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={3000}
        pauseOnHover={true}
        position="top-center"
      />
      {selectedProduct && <QuickViewDialog />}
      {isOpenAddressForm && <AddressForm />}
      {/* Account Menu - Controlled by Context */}
      {isOpenAccountMenu && <AccountMenu onClose={handleAccountMenuClose} />}
    </>
  );
}

export default App;
