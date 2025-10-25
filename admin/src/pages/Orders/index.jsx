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
import { useState } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { TablePagination } from "@mui/material";
import CustomModal from "../../components/CustomModal";

const Orders = () => {
  const [orderData, setOrderData] = useState([
    // --- Đơn hàng 1: Thanh toán qua Momo, đang xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3cf", // ObjectId của User
      orderCode: 1001,
      orderId: "ORD-20251011-A8B2C4",
      shippingInfo: {
        ward: "Phường Bến Nghé",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "123 Đường Đồng Khởi, Quận 1",
        phone: "0901234567",
        receiver: "Nguyễn Văn An",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5", // ObjectId của Product
          quantity: 2,
        },
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "Momo",
        status: "paid",
      },
      status: "waitting",
      couponCode: "SALE50",
      dateCreate: "21 Th 3",
    },

    // --- Đơn hàng 2: Thanh toán khi nhận hàng (COD), đã giao ---
    {
      userId: "6348acd2e1a47ca32e79f3d0",
      orderCode: 1002,
      orderId: "ORD-20251010-F5G6H7",
      shippingInfo: {
        ward: "Phường Hàng Trống",
        province: "Thành phố Hà Nội",
        addressDetail: "45 Phố Hàng Bông, Quận Hoàn Kiếm",
        phone: "0987654321",
        receiver: "Trần Thị Bích",
      },
      products: [
        {
          productId: "6348b03de1a47ca32e79f3db",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "paid", // Trạng thái này sẽ được cập nhật sau khi shipper thu tiền
      },
      status: "shipping",
      dateCreate: "21 Th 2",
    },

    // --- Đơn hàng 3: Thanh toán VNPay, đang chờ xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3d1",
      orderCode: 1003,
      orderId: "ORD-20251011-K9L0M1",
      shippingInfo: {
        ward: "Phường Hải Châu I",
        province: "Thành phố Đà Nẵng",
        addressDetail: "99 Đường Bạch Đằng, Quận Hải Châu",
        phone: "0333444555",
        receiver: "Lê Văn Cường",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5",
          quantity: 5,
        },
      ],
      payment: {
        provider: "VNPay",
        status: "paid",
      },
      status: "preparing", // Trạng thái mặc định
      dateCreate: "21 Th 6",

      // "couponCode" không có, vì đây là trường không bắt buộc
    },

    // --- Đơn hàng 4: Đã bị hủy ---
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
    {
      userId: "6348acd2e1a47ca32e79f3cf", // ObjectId của User
      orderCode: 1001,
      orderId: "ORD-20251011-A8B2C4",
      shippingInfo: {
        ward: "Phường Bến Nghé",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "123 Đường Đồng Khởi, Quận 1",
        phone: "0901234567",
        receiver: "Nguyễn Văn An",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5", // ObjectId của Product
          quantity: 2,
        },
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "Momo",
        status: "paid",
      },
      status: "waitting",
      couponCode: "SALE50",
      dateCreate: "21 Th 3",
    },

    // --- Đơn hàng 2: Thanh toán khi nhận hàng (COD), đã giao ---
    {
      userId: "6348acd2e1a47ca32e79f3d0",
      orderCode: 1002,
      orderId: "ORD-20251010-F5G6H7",
      shippingInfo: {
        ward: "Phường Hàng Trống",
        province: "Thành phố Hà Nội",
        addressDetail: "45 Phố Hàng Bông, Quận Hoàn Kiếm",
        phone: "0987654321",
        receiver: "Trần Thị Bích",
      },
      products: [
        {
          productId: "6348b03de1a47ca32e79f3db",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "paid", // Trạng thái này sẽ được cập nhật sau khi shipper thu tiền
      },
      status: "shipping",
      dateCreate: "21 Th 2",
    },

    // --- Đơn hàng 3: Thanh toán VNPay, đang chờ xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3d1",
      orderCode: 1003,
      orderId: "ORD-20251011-K9L0M1",
      shippingInfo: {
        ward: "Phường Hải Châu I",
        province: "Thành phố Đà Nẵng",
        addressDetail: "99 Đường Bạch Đằng, Quận Hải Châu",
        phone: "0333444555",
        receiver: "Lê Văn Cường",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5",
          quantity: 5,
        },
      ],
      payment: {
        provider: "VNPay",
        status: "paid",
      },
      status: "preparing", // Trạng thái mặc định
      dateCreate: "21 Th 6",

      // "couponCode" không có, vì đây là trường không bắt buộc
    },

    // --- Đơn hàng 4: Đã bị hủy ---
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
    {
      userId: "6348acd2e1a47ca32e79f3cf", // ObjectId của User
      orderCode: 1001,
      orderId: "ORD-20251011-A8B2C4",
      shippingInfo: {
        ward: "Phường Bến Nghé",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "123 Đường Đồng Khởi, Quận 1",
        phone: "0901234567",
        receiver: "Nguyễn Văn An",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5", // ObjectId của Product
          quantity: 2,
        },
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "Momo",
        status: "paid",
      },
      status: "waitting",
      couponCode: "SALE50",
      dateCreate: "21 Th 3",
    },

    // --- Đơn hàng 2: Thanh toán khi nhận hàng (COD), đã giao ---
    {
      userId: "6348acd2e1a47ca32e79f3d0",
      orderCode: 1002,
      orderId: "ORD-20251010-F5G6H7",
      shippingInfo: {
        ward: "Phường Hàng Trống",
        province: "Thành phố Hà Nội",
        addressDetail: "45 Phố Hàng Bông, Quận Hoàn Kiếm",
        phone: "0987654321",
        receiver: "Trần Thị Bích",
      },
      products: [
        {
          productId: "6348b03de1a47ca32e79f3db",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "paid", // Trạng thái này sẽ được cập nhật sau khi shipper thu tiền
      },
      status: "shipping",
      dateCreate: "21 Th 2",
    },

    // --- Đơn hàng 3: Thanh toán VNPay, đang chờ xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3d1",
      orderCode: 1003,
      orderId: "ORD-20251011-K9L0M1",
      shippingInfo: {
        ward: "Phường Hải Châu I",
        province: "Thành phố Đà Nẵng",
        addressDetail: "99 Đường Bạch Đằng, Quận Hải Châu",
        phone: "0333444555",
        receiver: "Lê Văn Cường",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5",
          quantity: 5,
        },
      ],
      payment: {
        provider: "VNPay",
        status: "paid",
      },
      status: "preparing", // Trạng thái mặc định
      dateCreate: "21 Th 6",

      // "couponCode" không có, vì đây là trường không bắt buộc
    },

    // --- Đơn hàng 4: Đã bị hủy ---
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
    {
      userId: "6348acd2e1a47ca32e79f3cf", // ObjectId của User
      orderCode: 1001,
      orderId: "ORD-20251011-A8B2C4",
      shippingInfo: {
        ward: "Phường Bến Nghé",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "123 Đường Đồng Khởi, Quận 1",
        phone: "0901234567",
        receiver: "Nguyễn Văn An",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5", // ObjectId của Product
          quantity: 2,
        },
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "Momo",
        status: "paid",
      },
      status: "waitting",
      couponCode: "SALE50",
      dateCreate: "21 Th 3",
    },

    // --- Đơn hàng 2: Thanh toán khi nhận hàng (COD), đã giao ---
    {
      userId: "6348acd2e1a47ca32e79f3d0",
      orderCode: 1002,
      orderId: "ORD-20251010-F5G6H7",
      shippingInfo: {
        ward: "Phường Hàng Trống",
        province: "Thành phố Hà Nội",
        addressDetail: "45 Phố Hàng Bông, Quận Hoàn Kiếm",
        phone: "0987654321",
        receiver: "Trần Thị Bích",
      },
      products: [
        {
          productId: "6348b03de1a47ca32e79f3db",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "paid", // Trạng thái này sẽ được cập nhật sau khi shipper thu tiền
      },
      status: "shipping",
      dateCreate: "21 Th 2",
    },

    // --- Đơn hàng 3: Thanh toán VNPay, đang chờ xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3d1",
      orderCode: 1003,
      orderId: "ORD-20251011-K9L0M1",
      shippingInfo: {
        ward: "Phường Hải Châu I",
        province: "Thành phố Đà Nẵng",
        addressDetail: "99 Đường Bạch Đằng, Quận Hải Châu",
        phone: "0333444555",
        receiver: "Lê Văn Cường",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5",
          quantity: 5,
        },
      ],
      payment: {
        provider: "VNPay",
        status: "paid",
      },
      status: "preparing", // Trạng thái mặc định
      dateCreate: "21 Th 6",

      // "couponCode" không có, vì đây là trường không bắt buộc
    },

    // --- Đơn hàng 4: Đã bị hủy ---
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
    {
      userId: "6348acd2e1a47ca32e79f3cf", // ObjectId của User
      orderCode: 1001,
      orderId: "ORD-20251011-A8B2C4",
      shippingInfo: {
        ward: "Phường Bến Nghé",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "123 Đường Đồng Khởi, Quận 1",
        phone: "0901234567",
        receiver: "Nguyễn Văn An",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5", // ObjectId của Product
          quantity: 2,
        },
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "Momo",
        status: "paid",
      },
      status: "waitting",
      couponCode: "SALE50",
      dateCreate: "21 Th 3",
    },

    // --- Đơn hàng 2: Thanh toán khi nhận hàng (COD), đã giao ---
    {
      userId: "6348acd2e1a47ca32e79f3d0",
      orderCode: 1002,
      orderId: "ORD-20251010-F5G6H7",
      shippingInfo: {
        ward: "Phường Hàng Trống",
        province: "Thành phố Hà Nội",
        addressDetail: "45 Phố Hàng Bông, Quận Hoàn Kiếm",
        phone: "0987654321",
        receiver: "Trần Thị Bích",
      },
      products: [
        {
          productId: "6348b03de1a47ca32e79f3db",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "paid", // Trạng thái này sẽ được cập nhật sau khi shipper thu tiền
      },
      status: "shipping",
      dateCreate: "21 Th 2",
    },

    // --- Đơn hàng 3: Thanh toán VNPay, đang chờ xử lý ---
    {
      userId: "6348acd2e1a47ca32e79f3d1",
      orderCode: 1003,
      orderId: "ORD-20251011-K9L0M1",
      shippingInfo: {
        ward: "Phường Hải Châu I",
        province: "Thành phố Đà Nẵng",
        addressDetail: "99 Đường Bạch Đằng, Quận Hải Châu",
        phone: "0333444555",
        receiver: "Lê Văn Cường",
      },
      products: [
        {
          productId: "6348b01be1a47ca32e79f3d5",
          quantity: 5,
        },
      ],
      payment: {
        provider: "VNPay",
        status: "paid",
      },
      status: "preparing", // Trạng thái mặc định
      dateCreate: "21 Th 6",

      // "couponCode" không có, vì đây là trường không bắt buộc
    },

    // --- Đơn hàng 4: Đã bị hủy ---
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
    {
      userId: "6348acd2e1a47ca32e79f3cf",
      orderCode: 1004,
      orderId: "ORD-20251009-X1Y2Z3",
      shippingInfo: {
        ward: "Phường Thảo Điền",
        province: "Thành phố Hồ Chí Minh",
        addressDetail: "Số 10, Đường số 4, Quận 2",
        phone: "0777888999",
        receiver: "Phạm Thị Dung",
      },
      products: [
        {
          productId: "6348b02ce1a47ca32e79f3d8",
          quantity: 1,
        },
      ],
      payment: {
        provider: "COD",
        status: "unpaid",
      },
      status: "cancelled",
      couponCode: "FREESHIP",
      dateCreate: "15 Th 3",
    },
  ]);
  const [filter, setFilter] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(false);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  //DU lieu mau

  //Pagination
  const pageData = orderData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  console.log(JSON.stringify(filter));

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => console.log("Xóa đơn hàng")}
        content={"Bạn có muốn xóa đơn hàng này?"}
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

        <TableControlProvider
          controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
          controlSelectAll={{ selectedItem, setSelectedItem }}
          orderData={pageData}
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

          <TablePagination
            component="div"
            count={orderData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 30]}
            labelRowsPerPage="Số dòng mỗi trang"
          />

          <CustomModal type={"order"} />
        </TableControlProvider>
      </Container>
    </>
  );
};

export default Orders;
