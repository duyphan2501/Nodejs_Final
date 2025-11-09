import { Modal } from "@mui/material";
import avatarUser from "../../assets/svg/avatar_user.svg";
import CustomTable from "../CustomTable";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useTableControl } from "../TableControl/TableControllerContext";
import { useEffect, useState } from "react";
import useOrderStore from "../../../stores/useOrderStore";
import BiLoader from "../BiLoader";

export default function CustomModalOrder() {
  const { selectedDetail, setSelectedDetail } = useTableControl();
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const orderDetail = useOrderStore((s) => s.orderDetail);
  const setOrderDetail = useOrderStore((s) => s.setOrderDetail);
  const setOrderDetailList = useOrderStore((s) => s.setOrderDetailList);
  const orders = useOrderStore((s) => s.orders);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (!orderDetail?.items) return;

    const orderSearched = orderDetail.items.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setOrderDetailList(orderSearched);
  };

  useEffect(() => {
    if (!selectedDetail) {
      return;
    }

    getOrderById(selectedDetail);
  }, [selectedDetail]);

  return (
    <>
      <Modal
        open={selectedDetail}
        onClose={() => {
          setSelectedDetail(null);
          setOrderDetail({});
        }}
      >
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
            <div className="user-info flex flex-col items-center">
              <img src={avatarUser} alt="" className="w-20" />
              <h4 className="text-xl font-bold mt-5">
                {orderDetail?.shippingInfo?.receiver || "Unknown"}
              </h4>
              <h4 className="text-sm font-italic text-blue-500">
                {orderDetail?.email || "Unknown"}
              </h4>
              <p className="text-sm ">{orderDetail?.shippingInfo?.phone}</p>

              <div className="w-2/3 border border-gray-300 mt-3"></div>

              <h4 className="text-mds font-bold mt-5 w-full text-left">
                Địa chỉ ship
              </h4>
              <p className="text-sm w-full text-left">
                {`${orderDetail?.shippingInfo?.addressDetail}, ${orderDetail?.shippingInfo?.ward}, ${orderDetail?.shippingInfo?.province}`}
              </p>
            </div>
            <div className="product-info col-span-2">
              <input
                type="text"
                className="rounded-sm w-full border border-gray-400 p-2"
                placeholder="Tìm kiếm sản phẩm"
                onChange={(e) => handleChange(e)}
              />

              <CustomTable type={"order-detail"} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
