import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography, TablePagination } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TableControl from "../../components/TableControl";
import { TableControlProvider } from "../../components/TableControl/TableControllerContext";
import { useState } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import CustomModal from "../../components/CustomModal";

const Coupons = () => {
  const [couponData, setCouponData] = useState([
    {
      couponCode: "SALE50",
      discountType: "percentage",
      discountValue: 50,

      startDate: "2025-10-01",
      endDate: "2025-10-31",
      minOrderValue: 500000,
      maxDiscount: 200000,
      quantity: 10,
      used: 3,
      status: "active",
    },
    {
      couponCode: "FREESHIP",
      discountType: "fixed",
      discountValue: 30000,

      startDate: "2025-09-20",
      endDate: "2025-12-31",
      minOrderValue: 300000,
      maxDiscount: 30000,
      quantity: 200,
      used: 8,
      status: "active",
    },
    {
      couponCode: "NEWUSER10",
      discountType: "percentage",
      discountValue: 10,

      startDate: "2025-01-01",
      endDate: "2025-12-31",
      minOrderValue: 0,
      maxDiscount: 50000,
      quantity: 10,
      used: 1,
      status: "active",
    },
    {
      couponCode: "SUMMER2025",
      discountType: "fixed",
      discountValue: 100000,

      startDate: "2025-06-01",
      endDate: "2025-08-31",
      minOrderValue: 1000000,
      maxDiscount: 100000,
      quantity: 10,
      used: 2,
      status: "inactive",
    },
    {
      couponCode: "VIPCUSTOMER",
      discountType: "percentage",
      discountValue: 20,

      startDate: "2025-02-01",
      endDate: "2025-12-31",
      minOrderValue: 0,
      maxDiscount: 500000,
      quantity: 10,
      used: 7,
      status: "active",
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

  // Pagination
  const pageData = couponData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  console.log(JSON.stringify(filter));

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => console.log("Xóa coupon")}
        content={"Bạn có muốn xóa mã giảm giá này?"}
        action={"Xóa"}
      />

      <Navbar active="coupons" />

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
            Trang Quản Lý Mã Giảm Giá
          </Typography>
        </div>

        <div className="mt-3 grid md:grid-cols-5 gap-3">
          <DashboardCardProduct
            BackgroundColor="#4A90E2"
            icon={LocalOfferIcon}
            CardHeader="Tất Cả"
            CardDesc={`${couponData.length} Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#28A745"
            icon={CheckCircleIcon}
            CardHeader="Hoạt động"
            CardDesc={`${
              couponData.filter((c) => c.status === "active").length
            } Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#FFC107"
            icon={AccessTimeIcon}
            CardHeader="Sắp hết hạn"
            CardDesc="2 Mã"
          />
          <DashboardCardProduct
            BackgroundColor="#DC3545"
            icon={CancelIcon}
            CardHeader="Đã hết hạn"
            CardDesc={`${
              couponData.filter((c) => c.status === "expired").length
            } Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#6F42C1"
            icon={ConfirmationNumberIcon}
            CardHeader="Đã dùng"
            CardDesc={`${couponData.reduce((sum, c) => sum + c.used, 0)} Lần`}
          />
        </div>

        <TableControlProvider
          controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
          controlSelectAll={{ selectedItem, setSelectedItem }}
          couponData={pageData}
          filter={filter}
          setFilter={setFilter}
          controlSelectDetail={{ selectedDetail, setSelectedDetail }}
        >
          <div className="mt-3 bg-white shadow">
            <TableControl type={"coupon"} />
          </div>

          <div className="mt-3">
            <CustomTable type={"coupon"} />
          </div>

          <TablePagination
            component="div"
            count={couponData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 30]}
            labelRowsPerPage="Số dòng mỗi trang"
          />

          <CustomModal type={"coupon-edit"} />
        </TableControlProvider>
      </Container>
    </>
  );
};

export default Coupons;
