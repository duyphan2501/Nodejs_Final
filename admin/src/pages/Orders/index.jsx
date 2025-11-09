import { Container, order } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableControl from "../../components/TableControl";
import { TableControlProvider } from "../../components/TableControl/TableControllerContext";
import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import CustomModal from "../../components/CustomModal";
import useOrderStore from "../../../stores/useOrderStore";
import { toast } from "react-toastify";
import axiosPrivate from "../../../API/axiosPrivate";

const Orders = () => {
  //Khai bao state
  const orders = useOrderStore((s) => s.orders);
  const getOrders = useOrderStore((s) => s.getOrders);

  useEffect(() => {
    getOrders();
  }, []);

  const [filter, setFilter] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleConfirmDelete = async () => {
    try {
      const res = await axiosPrivate.delete("/api/order/delete", {
        data: { _ids: selectedItem },
      });

      if (res.data?.success) {
        toast.success(res.data.message);
        await getOrders();
        setSelectedItem([]);
      }
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      toast.error(message || "Xóa đơn hàng thất bại!");
    }
  };
  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        content={`Bạn có muốn xóa ${selectedItem.length} đơn hàng này?`}
        action={"Xóa"}
      />
      <Navbar active="orders" />
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <div className="mt-3">
          <Typography variant="body1" color="text.primary">
            OVERVIEW
          </Typography>
          <Typography variant="h4" fontSize={26} fontWeight={500}>
            Trang Đơn Hàng
          </Typography>
        </div>

        <div className="mt-3 grid md:grid-cols-5 gap-3">
          <DashboardCardProduct
            BackgroundColor="#F57E40"
            icon={InventoryIcon}
            CardHeader="Tất Cả"
            CardDesc={`${orders.length} Đơn hàng`}
          />
          <DashboardCardProduct
            BackgroundColor="#1A2C4E"
            icon={HourglassBottomIcon}
            CardHeader="Đang Xử Lý"
            CardDesc={`${
              orders.filter((ord) => ord.status === "pending").length
            } Đơn hàng`}
          />
          <DashboardCardProduct
            BackgroundColor="#F7B600"
            icon={HandshakeIcon}
            CardHeader="Đã Xác Nhận"
            CardDesc={`${
              orders.filter((ord) => ord.status === "confirmed").length
            } Đơn hàng`}
          />
          <DashboardCardProduct
            BackgroundColor="#689801"
            icon={LocalShippingIcon}
            CardHeader="Vận Chuyển"
            CardDesc={`${
              orders.filter((ord) => ord.status === "shipping").length
            } Đơn hàng`}
          />
          <DashboardCardProduct
            BackgroundColor="#B01D2A"
            icon={CheckCircleIcon}
            CardHeader="Đã Giao"
            CardDesc={`${
              orders.filter((ord) => ord.status === "delivered").length
            } Đơn hàng`}
          />
        </div>

        <TableControlProvider
          controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
          controlSelectAll={{ selectedItem, setSelectedItem }}
          // orderData={pageData}
          filter={filter}
          setFilter={setFilter}
          controlSelectDetail={{ selectedDetail, setSelectedDetail }}
        >
          <div className="mt-3 bg-white shadow">
            <TableControl type={"order"} />
          </div>

          <div className="mt-3">
            <CustomTable type={"order"} />
          </div>

          <CustomModal type={"order"} />
        </TableControlProvider>
      </Container>
    </>
  );
};

export default Orders;
