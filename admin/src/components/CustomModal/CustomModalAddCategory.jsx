import { Modal, Button, Slider } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const CustomModalAddCategory = ({ controlAddCategoryModal, type = "shoe" }) => {
  const axiosPrivate = useAxiosPrivate();
  const { addCategoryModal, setAddCategoryModal } = controlAddCategoryModal;

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      if (imageFile) formData.append("image", imageFile);

      const res = await axiosPrivate.post("/api/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Thêm danh mục thành công!");
        setName("");
        setImagePreview(null);
        setImageFile(null);
        setAddCategoryModal(false);
      } else {
        toast.error(res.data.message || "Thêm danh mục thất bại");
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.message || "Lỗi khi thêm danh mục";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={addCategoryModal} onClose={() => setAddCategoryModal(false)}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          minWidth: "80%",
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 className="capitalize text-lg font-bold mb-4">
          Thêm danh mục vào {type}
        </h1>

        <div className="flex flex-1 gap-6">
          {/* BÊN TRÁI - UPLOAD ẢNH */}
          <div className="flex flex-col items-center justify-center w-1/2 border rounded-lg p-4">
            <div
              className="relative border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
              style={{
                width: "180px",
                height: "240px", // hình chữ nhật dọc
                position: "relative",
              }}
            >
              {/* ẢNH XEM TRƯỚC */}
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="transition-transform duration-300 object-cover"
                  style={{
                    width: `${zoom}%`,
                    height: `${zoom}%`,
                    transform: `scale(${zoom / 100})`,
                  }}
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  Chưa chọn hình ảnh
                </span>
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(to right, rgba(0, 0, 0, 0.25) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                  pointerEvents: "none",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "rgba(0, 0, 0, 0.6)",
                    transform: "translateY(-50%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: "1px",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.6)",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-3 text-sm"
            />

            {imagePreview && (
              <div className="w-full mt-2">
                <label className="text-xs text-gray-500">Thu phóng ảnh:</label>
                <Slider
                  size="small"
                  value={zoom}
                  min={50}
                  max={150}
                  step={1}
                  onChange={(e, value) => setZoom(value)}
                  sx={{ color: "#4CAF50" }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between w-1/2">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-600">
                Tên danh mục:
              </label>
              <input
                type="text"
                placeholder="Nhập tên danh mục..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>

            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<AddCircleIcon />}
              sx={{
                mt: 4,
                alignSelf: "flex-start",
                px: 4,
                py: 1.2,
                textTransform: "none",
              }}
            >
              {loading ? "Đang thêm..." : "Thêm danh mục"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModalAddCategory;
