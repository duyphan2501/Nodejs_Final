import { Modal } from "@mui/material";

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
            maxHeight: "600px",
            overflow: "auto",
          }}
        >
          <h1 className="capitalize text-md font-bold">Sửa tên danh mục</h1>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md mt-3 p-3"
            placeholder={editModal?.name || ""}
          />
        </div>
      </Modal>
    </>
  );
};

export default CustomModalCategory;
