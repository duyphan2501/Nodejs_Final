import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CustomModalCategory = ({ controlEditModal }) => {
  const { editModal, setEditModal } = controlEditModal;
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
            />
            <Button sx={{ color: "green", height: "100%" }}>
              <CheckCircleIcon sx={{ fontSize: "40px" }} />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomModalCategory;
