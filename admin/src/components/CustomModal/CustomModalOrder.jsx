import { Modal } from "@mui/material";
import avatarUser from "../../assets/svg/avatar_user.svg";
import CustomTable from "../CustomTable";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useTableControl } from "../TableControl/TableControllerContext";

export default function CustomModalOrder() {
  const { selectedDetail, setSelectedDetail } = useTableControl();
  return (
    <>
      <Modal open={selectedDetail} onClose={() => setSelectedDetail(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px 40px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            minWidth: "80%",
            maxHeight: "600px",
            overflow: "auto",
          }}
        >
          <div className="w-full text-right">
            <Button
              sx={{ color: "red" }}
              className=""
              onClick={() => setSelectedDetail(false)}
            >
              <CloseIcon />
            </Button>
          </div>

          <h1 className="text-2xl font-bold capitalize">Đơn hàng #1001</h1>
          <p>Tổng quan</p>

          <div className="grid md:grid-cols-3 gap-5 mt-5">
            <div className="product-info col-span-2">
              <input
                type="text"
                className="rounded-sm w-full border border-gray-400 p-2"
                placeholder="Tìm kiếm sản phẩm"
              />

              <CustomTable type={"order-detail"} />
            </div>

            <div className="user-info flex flex-col items-center">
              <img src={avatarUser} alt="" className="w-20" />
              <h4 className="text-xl font-bold mt-5">Đỗ Trần Minh Đức</h4>
              <h6 className="text-blue-500">duc@gmail.com</h6>
              <p className="text-sm">09809787692</p>

              <div className="w-2/3 border border-gray-300 mt-3"></div>

              <h4 className="text-mds font-bold mt-5 w-full text-left">
                Địa chỉ ship
              </h4>
              <p className="text-sm w-full text-left">
                27, Đường D6, Phường Tân Phong, TP Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
