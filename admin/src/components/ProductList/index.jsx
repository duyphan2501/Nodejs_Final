import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarRate from "../StarRate";

const ProductCard = ({
  id,
  name,
  brand,
  price,
  stock,
  totalStock,
  sold,
  image,
  active = true,
  checked,
  toggleSelect,
  chooseToEdit,
}) => {
  const [isActive, setIsActive] = useState(active);

  return (
    <div
      onClick={() => chooseToEdit(id)}
      className="w-full max-w-xs rounded-2xl shadow-lg overflow-hidden hover:border relative p-4 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
    >
      {/* Checkbox chọn sản phẩm */}
      <input
        type="checkbox"
        className="absolute top-3 left-3 w-5 h-5 accent-blue-500 cursor-pointer"
        checked={checked}
        onChange={toggleSelect}
      />

      {/* Nút Active / Inactive */}
      <div className="absolute top-3 right-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
      </div>

      {/* Ảnh sản phẩm */}
      <img src={image} alt={name} className="w-full h-48 object-cover" />

      {/* Nội dung */}
      <div className="mt-3 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500">
          Brand: <span className="font-medium">{brand}</span>
        </p>
        <p className="text-red-600 font-bold text-base">
          {price.toLocaleString("vi-VN")}₫
        </p>

        {/* Thanh tồn kho */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              Tồn kho: {stock}/{totalStock}
            </span>
          </div>
          <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
            <div
              className={`h-2 rounded ${
                stock / totalStock < 0.3
                  ? "bg-red-500"
                  : stock / totalStock < 0.7
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${(stock / totalStock) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-2">
          <StarRate star={4.5} quantity={1000} />
        </div>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Đã bán:</span> {sold} đôi
        </p>
      </div>
    </div>
  );
};

const ProductList = ({
  products,
  selectedProducts,
  setSelectedProducts,
  chooseToEdit,
}) => {
  const toggleSelect = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((item) => item != id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const totalPages = Math.ceil(products.length / pageSize);

  const currentData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Grid product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentData.map((p, i) => (
          <ProductCard
            key={i}
            {...p}
            checked={selectedProducts.includes(p.id)}
            toggleSelect={() => toggleSelect(p.id)}
            chooseToEdit={chooseToEdit}
          />
        ))}
      </div>

      {/* Pagination*/}
      <div className="flex justify-center items-center mt-6 space-x-2 cursor-pointer">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ArrowBackIosIcon />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded  cursor-pointer ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded  cursor-pointer disabled:opacity-50"
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );
};

export default ProductList;
