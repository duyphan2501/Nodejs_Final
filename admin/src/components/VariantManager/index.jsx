import { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import TransitionsModal from "../TransitionsModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CustomSnackbar from "../CustomSnackbar";
import ConfirmDialog from "../ConfirmDialog";

const VariantManager = ({
  openSnackbar,
  handleChangeInput,
  reset,
  variantEdit,
}) => {
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    handleChangeInput("variants", variants);
  }, [variants]);

  useEffect(() => {
    setVariants([]);
  }, [reset]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 2;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItem = variants.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      color: "",
      attributes: {
        types: [],
      },
      images: Array(6).fill(null),
      save: false,
    };
    setVariants([...variants, newVariant]);
  };

  const saveVariant = (id, data) => {
    // chỉ lưu state khi bấm Save
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data, save: true } : v))
    );
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
          save={variant.save}
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

const VariantEach = ({ id, onDelete, onSave, openSnackbar, save }) => {
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState(
    Array.from({ length: 10 }, (_, i) => i + 35).reduce((acc, size) => {
      acc[size] = "";
      return acc;
    }, {})
  );
  const [basePrice, setBasePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const sellPrice = useMemo(() => {
    const result = Math.round(basePrice * ((100 - discount) / 100));
    return result.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }, [basePrice, discount]);

  // Modal khi lỗi
  const [modalOpen, setModalOpen] = useState(false);

  // State quản lý ảnh
  const [images, setImages] = useState(Array(5).fill(null));

  //State quan ly confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [warning, setWarning] = useState({
    img: false,
    text: false,
    number: false,
  });

  const handleSave = () => {
    const newWarning = {};

    // Kiểm tra label và name
    if (color === "") {
      newWarning.text = true;
    } else {
      newWarning.text = false;
    }

    const allImagesUploaded = images.every((img) => img !== null);

    if (!allImagesUploaded) {
      newWarning.img = true;
    } else {
      newWarning.img = false;
    }

    const values = Object.values(sizes);

    // Ít nhất một giá trị lớn hơn 0
    const hasPositive = values.some((qty) => Number(qty) > 0);

    if (!hasPositive) {
      newWarning.size = true;
    } else {
      newWarning.size = false;
    }

    // Kiểm tra discount không vượt quá 100
    if (discount < 0 || discount > 100) {
      newWarning.number = true;
    } else {
      newWarning.number = false;
    }

    // Nếu có cảnh báo nào thì set warning và không save
    if (Object.values(newWarning).some((w) => w === true)) {
      setWarning(newWarning);
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSave(id, {
      color,
      attributes: translateIntoObject(sizes),
      price: basePrice,
      discount,
      images,
    });
    setConfirmOpen(false);
    openSnackbar();
  };

  // Upload ảnh
  const handleImageChange = (e, startIndex) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...images];

      files.forEach((file, idx) => {
        const targetIndex = startIndex + idx;
        if (targetIndex < newImages.length) {
          newImages[targetIndex] = {
            file,
            preview: URL.createObjectURL(file),
          };
        }
      });

      setImages(newImages);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  //Hàm chuyển key - value "Size : Stock" thành {Stock: x, Size: x}
  const translateIntoObject = (inputSizeObj) => {
    const type = Object.entries(inputSizeObj)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => ({
        size: key,
        inStock: Number.parseFloat(value),
      }));

    return type;
  };

  return (
    <div className="mt-3 w-full flex flex-col gap-4 input-group p-4 rounded-lg shadow bg-[#F9FAFB]">
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        content={"Bạn sẽ không thể chỉnh sửa sau khi lưu"}
        action={"Lưu"}
      />
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
            className={`w-28 h-28 bg-gray-100 border-2 border-dashed ${
              save
                ? "border-gray-300 cursor-not-allowed opacity-70"
                : "hover:border-blue-500 hover:bg-blue-50"
            } border-gray-400 flex items-center justify-center relative rounded-lg overflow-hidden`}
          >
            {img ? (
              <>
                <img
                  src={img.preview}
                  alt={`variant-${i}`}
                  className="w-full h-full object-cover"
                />
                {!save && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                )}
              </>
            ) : (
              <>
                <label
                  htmlFor={`upload-${id}-${i}`}
                  className={`cursor-pointer text-gray-500 text-2xl ${
                    save ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  +
                </label>
                <input
                  id={`upload-${id}-${i}`}
                  type="file"
                  accept="image/*"
                  multiple // <--- thêm multiple
                  className="hidden"
                  onChange={!save ? (e) => handleImageChange(e, i) : undefined}
                  disabled={save}
                />
              </>
            )}
          </div>
        ))}
      </div>
      {warning.img ? (
        <div id="warning-img" className="text-red-500 bg-red-100 text-left p-2">
          Phải chèn đủ 5 ảnh mỗi biến thể
        </div>
      ) : (
        ""
      )}

      {/* Form nhập tên/nhãn */}
      <div className="form-input gap-4">
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Tên biến thể"
          disabled={save}
        />
      </div>
      {warning.text ? (
        <div
          id="warning-text"
          className="text-red-500 bg-red-100 text-left p-2"
        >
          Không để trống trường này
        </div>
      ) : (
        ""
      )}

      {/* Giá gốc / Discount / Giá bán */}
      <div className="form-input grid grid-cols-3 gap-4">
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          placeholder="Giá Bán Gốc"
          title="Giá Bán Gốc"
          disabled={save}
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full bg-gray-100 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          title="Discount (%)"
          disabled={save}
        />
        <input
          type="text"
          value={sellPrice}
          className="w-full bg-gray-300 shadow rounded h-12 p-3 capitalize focus:ring-0 focus:outline-none"
          title="Giá Bán Chính thức"
          disabled
        />
      </div>
      {warning.number ? (
        <div
          id="warning-number"
          className="text-red-500 bg-red-100 text-left p-2"
        >
          Discount không quá 100%
        </div>
      ) : (
        ""
      )}

      {/* Size */}
      <div className="form-input-size flex flex-wrap gap-4 justify-between">
        {save
          ? Object.keys(sizes).map((size) => (
              <input
                key={size}
                type="text"
                value={sizes[size]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setSizes({
                      ...sizes,
                      [size]: value,
                    });
                  }
                }}
                className="w-15 h-15 p-4 focus:ring-0 focus:outline-none 
               bg-gray-100 shadow capitalize 
               placeholder:italic placeholder:text-center 
               placeholder:text-sm text-center"
                placeholder={size}
                title={`Size ${size}`}
                disabled
              />
            ))
          : Object.keys(sizes).map((size) => (
              <input
                key={size}
                type="text"
                value={sizes[size]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setSizes({
                      ...sizes,
                      [size]: value,
                    });
                  }
                }}
                className="w-15 h-15 p-4 focus:ring-0 focus:outline-none 
               bg-gray-100 shadow capitalize 
               placeholder:italic placeholder:text-center 
               placeholder:text-sm text-center"
                placeholder={size}
                title={`Size ${size}`}
              />
            ))}
      </div>
      {warning.size ? (
        <div
          id="warning-size"
          className="text-red-500 bg-red-100 text-left p-2"
        >
          Phải có ít nhất một size có số lượng khác 0
        </div>
      ) : (
        ""
      )}

      {/* Nút Save / Delete */}
      <div className="button-group w-full flex justify-end gap-2">
        {save ? (
          ""
        ) : (
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
        )}

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
