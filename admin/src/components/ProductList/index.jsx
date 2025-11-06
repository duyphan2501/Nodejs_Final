import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarRate from "../StarRate";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const ProductCard = ({
  _id,
  name,
  brand,
  inputPrice,
  totalStock,
  image,
  stars,
  totalRating,
  checked,
  toggleSelect,
  chooseToEdit,
}) => {
  return (
    <div
      onDoubleClick={() => chooseToEdit(_id)}
      className="w-full max-w-xs rounded-2xl shadow-lg overflow-hidden hover:border relative p-4 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
    >
      {/* Checkbox chọn sản phẩm */}
      <input
        type="checkbox"
        className="absolute top-3 left-3 w-5 h-5 accent-blue-500 cursor-pointer"
        checked={checked}
        onChange={toggleSelect}
      />

      {/* Ảnh sản phẩm */}
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
        alt={name}
        className="w-full h-48 object-cover"
      />

      {/* Nội dung */}
      <div className="mt-3 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500">
          Brand: <span className="font-medium">{brand}</span>
        </p>
        <p className="text-red-600 font-bold text-base">
          {inputPrice.toLocaleString("vi-VN")}₫
        </p>

        {/* Thanh tồn kho */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tồn kho: {totalStock}</span>
          </div>
        </div>

        <div className="mt-2">
          <StarRate star={stars} quantity={totalRating} />
        </div>
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
            key={p._id}
            {...p}
            checked={selectedProducts.includes(p._id)}
            toggleSelect={() => toggleSelect(p._id)}
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
