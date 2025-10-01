import { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";

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
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/admin/home" element={<Home />}></Route>
            <Route path="/admin/products" element={<Products />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
