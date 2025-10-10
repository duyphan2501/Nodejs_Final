import { Container } from "@mui/system";
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
import { useState } from "react";
import CustomTable from "../../components/CustomTable";

const Orders = () => {
  return (
    <>
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
            CardDesc="28 Đơn hàng"
          />
          <DashboardCardProduct
            BackgroundColor="#1A2C4E"
            icon={HourglassBottomIcon}
            CardHeader="Chờ Xác Nhận"
            CardDesc="10 Đơn hàng"
          />
          <DashboardCardProduct
            BackgroundColor="#F7B600"
            icon={HandshakeIcon}
            CardHeader="Chờ Chuẩn Bị"
            CardDesc="10 Đơn hàng"
          />
          <DashboardCardProduct
            BackgroundColor="#689801"
            icon={LocalShippingIcon}
            CardHeader="Vận Chuyển"
            CardDesc="10 Đơn hàng"
          />
          <DashboardCardProduct
            BackgroundColor="#B01D2A"
            icon={CheckCircleIcon}
            CardHeader="Hoàn Thành"
            CardDesc="10 Đơn hàng"
          />
        </div>

        <TableControlProvider>
          <div className="mt-3 bg-white shadow">
            <TableControl type={"order"} />
          </div>

          <div className="mt-3">
            <CustomTable type={"order"} />
          </div>
        </TableControlProvider>
      </Container>
    </>
  );
};

export default Orders;
