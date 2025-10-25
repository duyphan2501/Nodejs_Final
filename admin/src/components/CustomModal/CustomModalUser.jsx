import { Modal } from "@mui/material";
import avatarUser from "../../assets/svg/avatar_user.svg";
import CustomTable from "../CustomTable";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomSwiper from "../CustomSwiper";
import CustomInput from "../CustomInput";
import { width } from "@mui/system";

export default function CustomModalUser() {
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
          <div className="w-full flex justify-end">
            <Button
              variant="contained"
              sx={{
                width: "200px",
                padding: "10px 10px",
                background: "#00C950",
              }}
              onClick={() => setSelectedDetail(false)}
            >
              Lưu Thông Tin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="user-info flex flex-col items-center">
              <h1 className="text-lg font-bold w-full text-left">Profile</h1>
              <img src={avatarUser} className="w-20" alt="" />
              <h4 className="text-xl font-bold mt-5">Đỗ Trần Minh Đức</h4>
              <h6 className="text-blue-500 text-sm">21.000 Điểm</h6>
              <div className="detail-info w-full mt-5 text-left">
                <h6 className="text-sm font-bold uppercase">Email</h6>
                <p className="text-sm uppercase">duc@gmail.com</p>

                <h6 className="text-sm mt-3 font-bold uppercase">
                  Số điện thoại
                </h6>
                <p className="text-sm uppercase">84 09389501823</p>

                <h6 className="text-sm mt-3 font-bold uppercase">Địa điểm</h6>
                <p className="text-sm uppercase">
                  27, Đường D6, Phường Tân Phong, TP Hồ Chí Minh
                </p>

                <h6 className="text-sm mt-3 font-bold uppercase">Trạng thái</h6>
                <p className="p-2 bg-[#DFF8ED] text-green-700 w-30 text-center text-sm rounded-md">
                  Hoạt động
                </p>

                <h6 className="text-sm mt-10 font-bold uppercase">Tổng chi</h6>
                <p className="text-2xl uppercase font-bold">230,000,000₫</p>
              </div>
            </div>
            <div className="col-span-2 w-full overflow-y-auto">
              <h1 className="text-xl font-bold">Profile Settings</h1>
              <h6 className="text-sm mt-4 font-bold uppercase mb-2">
                Sổ địa chỉ
              </h6>
              <CustomSwiper type={"user-detail"} />

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <CustomInput
                  type={"text"}
                  id={"firstname"}
                  label={"Họ"}
                  name={"firstname"}
                  value={"Đỗ"}
                />
                <CustomInput
                  type={"text"}
                  id={"lastname"}
                  label={"Tên"}
                  name={"lastname"}
                  value={"Trần Minh Đức"}
                />
                <CustomInput
                  type={"text"}
                  id={"username"}
                  label={"Username"}
                  name={"username"}
                  value={"usernameduc"}
                />
                <CustomInput
                  type={"text"}
                  id={"email"}
                  label={"Email"}
                  name={"email"}
                  value={"duc@gmail.com"}
                />
                <CustomInput
                  type={"text"}
                  id={"phone"}
                  label={"Số điện thoại"}
                  name={"phone"}
                  value={"09394893823"}
                />
                <CustomInput
                  type={"text"}
                  id={"point"}
                  label={"Điểm thưởng"}
                  name={"point"}
                  value={"21.000"}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
