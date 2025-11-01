import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import useCategoryStore from "../../../stores/useCategoryStore";

const CustomModalCategory = ({ controlEditModal }) => {
  const axiosPrivate = useAxiosPrivate();

  const {
    setShoeCategories,
    setSandalCategories,
    setBackpackCategories,
    shoeCategories,
    sandalCategories,
    backPackCategories,
  } = useCategoryStore();

  const fetchCategories = async () => {
    try {
      const [shoeRes, sandalRes, backpackRes] = await Promise.all([
        axiosPrivate.get("/api/category/shoe"),
        axiosPrivate.get("/api/category/sandal"),
        axiosPrivate.get("/api/category/backpack"),
      ]);

      setShoeCategories(shoeRes.data.categories);
      setSandalCategories(sandalRes.data.categories);
      setBackpackCategories(backpackRes.data.categories);
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu danh mục thất bại");
    }
  };

  const { editModal, setEditModal } = controlEditModal;

  const handleChangeInput = (e) => {
    setEditModal((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  //Call API để sửa tên danh mục
  const editCategoryName = async () => {
    try {
      const res = await axiosPrivate.put(`/api/category/${editModal.id}`, {
        newName: editModal.name,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setEditModal(null);
        await fetchCategories();
      }
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Sửa tên danh mục thất bại!";
      toast.error(message);
    }
  };

  return (
    <>
      <Modal open={editModal !== null} onClose={() => setEditModal(null)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            minWidth: "80%",
            height: "130px",
            overflow: "auto",
          }}
        >
          <h1 className="capitalize text-md font-bold">Sửa tên danh mục</h1>
          <div className="flex justify-center items-center mt-3">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-l-md p-3"
              placeholder={editModal?.name || ""}
              onChange={(e) => handleChangeInput(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editCategoryName();
                }
              }}
            />
            <Button
              onClick={editCategoryName}
              sx={{ color: "green", height: "100%" }}
            >
              <CheckCircleIcon sx={{ fontSize: "40px" }} />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomModalCategory;
