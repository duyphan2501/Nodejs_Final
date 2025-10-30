import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ToastContainer } from "react-toastify";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Category from "./pages/Category";
import Users from "./pages/Users";
import Coupons from "./pages/Coupon";
import Themes from "./pages/Themes";
import Login from "./pages/Login";

const theme = createTheme({
  palette: {
    text: {
      primary: "#374151", // màu chữ mặc định
      secondary: "#6B7280", // màu chữ phụ
    },
  },
  typography: {
    fontFamily: "'Be Vietnam Pro', sans-serif",
  },
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB]">
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              <Route path="/admin/home" element={<Home />}></Route>
              <Route path="/admin/products" element={<Products />}></Route>
              <Route path="/admin/orders" element={<Orders />}></Route>
              <Route path="/admin/category" element={<Category />}></Route>
              <Route path="/admin/users" element={<Users />}></Route>
              <Route path="/admin/coupon" element={<Coupons />}></Route>
              <Route path="/admin/themes" element={<Themes />}></Route>
              <Route path="/admin/login" element={<Login />}></Route>
            </Routes>
          </Router>
          <ToastContainer
            autoClose={3000}
            pauseOnHover={true}
            position="top-center"
          />
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
