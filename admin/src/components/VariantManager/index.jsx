import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import TransitionsModal from "../TransitionsModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CustomSnackbar from "../CustomSnackbar";

const VariantManager = ({ openSnackbar }) => {
  const [variants, setVariants] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 2;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItem = variants.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      label: "",
      name: "",
      sizes: Array(10).fill(""),
      images: Array(6).fill(null),
    };
    setVariants([...variants, newVariant]);
  };

  const saveVariant = (id, data) => {
    // chỉ lưu state khi bấm Save
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data } : v))
    );
    console.log("Đang lưu...", data);
  };

  const deleteVariant = (id) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="text-end w-full">
      <Button
        sx={{
          background: "#079CFD",
          color: "white",
          borderRadius: "10px",
          textTransform: "capitalize",
          padding: "5px",
          aspectRatio: "1/1",
        }}
        onClick={addVariant}
      >
        <AddIcon sx={{ fontSize: "40px" }} />
      </Button>

      {currentItem.map((variant) => (
        <VariantEach
          key={variant.id}
          id={variant.id}
          onDelete={deleteVariant}
          onSave={saveVariant}
          openSnackbar={openSnackbar}
        />
      ))}

      <div className="flex items-center gap-2 mt-4">
        {/* Nút Prev */}
        <button
          className={`px-3 py-1 border rounded disabled:opacity-50 ${
            currentPage !== 1
              ? "hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
              : ""
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* Các số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 border rounded cursor-pointer ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white hover:border-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        {/* Nút Next */}
        <button
          className={`px-3 py-1 border rounded disabled:opacity-50 ${
            currentPage !== totalPages
              ? "hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
              : ""
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

const VariantEach = ({ id, onDelete, onSave, openSnackbar }) => {
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState(
    Array.from({ length: 10 }, (_, i) => i + 35).reduce((acc, size) => {
      acc[size] = "";
      return acc;
    }, {})
  );
  const [basePrice, setBasePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const sellPrice = useMemo(() => {
    return Math.round(basePrice * ((100 - discount) / 100));
  }, [basePrice, discount]);

  // Modal khi lỗi
  const [modalOpen, setModalOpen] = useState(false);

  // State quản lý ảnh
  const [images, setImages] = useState(Array(5).fill(null));

  const handleSave = () => {
    if (!label || !name) {
      setModalOpen(true);
      return;
    }
    onSave(id, { label, name, sizes, basePrice, discount, sellPrice, images });
    openSnackbar();
  };

  // Upload ảnh
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImages(newImages);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  return (
    <div className="mt-3 w-full flex flex-col gap-4 input-group p-4 rounded-lg shadow bg-[#F9FAFB]">
      <TransitionsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Lỗi lưu biến thể"
        content="Bạn cần nhập đủ nhãn và tên biến thể trước khi lưu."
      />

      {/* ✅ Upload hình ảnh */}
      <div className="img-group mt-2 flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="w-28 h-28 bg-gray-100 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 border-gray-400 flex items-center justify-center relative rounded-lg overflow-hidden"
          >
            {img ? (
              <>
                <img
                  src={img.preview}
                  alt={`variant-${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <label
                  htmlFor={`upload-${id}-${i}`}
                  className="cursor-pointer text-gray-500 text-2xl"
                >
                  +
                </label>
                <input
                  id={`upload-${id}-${i}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, i)}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Form nhập tên/nhãn */}
      <div className="form-input grid grid-cols-2 gap-4">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Nhãn Biến thể"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Tên biến thể"
        />
      </div>

      {/* Giá gốc / Discount / Giá bán */}
      <div className="form-input grid grid-cols-3 gap-4">
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Giá Bán Gốc"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Discount (%)"
        />
        <input
          type="text"
          value={sellPrice}
          className="w-full bg-gray-300 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Giá Bán Chính thức"
          disabled
        />
      </div>

      {/* Size */}
      <div className="form-input-size flex flex-wrap gap-4 justify-between">
        {Object.keys(sizes).map((size) => (
          <input
            key={size}
            type="text"
            value={sizes[size]}
            onChange={(e) =>
              setSizes({
                ...sizes,
                [size]: e.target.value,
              })
            }
            className="w-15 h-15 p-4 focus:ring-0 focus:outline-none 
               bg-gray-100 shadow capitalize 
               placeholder:italic placeholder:text-center 
               placeholder:text-sm text-center"
            placeholder={size}
            title={`Size ${size}`}
          />
        ))}
      </div>

      {/* Nút Save / Delete */}
      <div className="button-group w-full flex justify-end gap-2">
        <Button
          sx={{
            background: "#008000",
            color: "white",
            borderRadius: "10px",
            textTransform: "capitalize",
            minWidth: "unset",
            width: "40px",
            height: "40px",
          }}
          onClick={handleSave}
        >
          <SaveAltIcon sx={{ fontSize: "24px" }} />
        </Button>

        <Button
          sx={{
            background: "#FEE2E2",
            color: "red",
            borderRadius: "10px",
            textTransform: "capitalize",
            minWidth: "unset",
            width: "40px",
            height: "40px",
          }}
          onClick={() => onDelete(id)}
        >
          <DeleteIcon sx={{ fontSize: "24px" }} />
        </Button>
      </div>
    </div>
  );
};

export default VariantManager;
