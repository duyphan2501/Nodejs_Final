import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={3000} pauseOnHover={true} position="top-center"/>
    </>
  );
}

export default App;
