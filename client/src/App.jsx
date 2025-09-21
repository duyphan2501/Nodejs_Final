import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
//import USPHeader from "./layouts/USPHeader";
import USPHeader from "./layouts/Header";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/login"} element={<Login />} />
          <Route path={"/"} element={<USPHeader />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={3000}
        pauseOnHover={true}
        position="top-center"
      />

      {/* Demo content below */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Main Content Area</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          This is where your main website content would go. The USP header above
          is fully responsive and matches the Adidas design pattern. Click the
          header to see the dropdown panel in action.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Card {i}</h3>
              <p className="text-gray-600">
                Sample content to demonstrate the layout.
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Demo content below */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Main Content Area</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          This is where your main website content would go. The USP header above
          is fully responsive and matches the Adidas design pattern. Click the
          header to see the dropdown panel in action.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Card {i}</h3>
              <p className="text-gray-600">
                Sample content to demonstrate the layout.
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Demo content below */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Main Content Area</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          This is where your main website content would go. The USP header above
          is fully responsive and matches the Adidas design pattern. Click the
          header to see the dropdown panel in action.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Card {i}</h3>
              <p className="text-gray-600">
                Sample content to demonstrate the layout.
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
