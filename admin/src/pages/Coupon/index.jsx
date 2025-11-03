// pages/Coupons/index.jsx
import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography, TablePagination, CircularProgress } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TableControl from "../../components/TableControl";
import { TableControlProvider } from "../../components/TableControl/TableControllerContext";
import { useState, useEffect } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import CustomModal from "../../components/CustomModal";
import useCoupon from "../../../hooks/useCoupon";
import useCouponStore from "../../../stores/useCouponStore";

const Coupons = () => {
  const { fetchCoupons, loading, error } = useCoupon();
  const { coupons } = useCouponStore();

  const [filter, setFilter] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

  // Fetch coupons khi component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Convert dữ liệu từ API sang format của frontend
  const transformedCoupons = coupons.map((coupon) => ({
    _id: coupon._id,
    couponCode: coupon.code,
    discountType: coupon.discountType === "percent" ? "percentage" : "fixed",
    discountValue:
      coupon.discountType === "percent"
        ? coupon.discountPercent
        : coupon.discountAmount,
    discountDisplay:
      coupon.discountType === "percent"
        ? `${coupon.discountPercent}%`
        : `${coupon.discountAmount.toLocaleString()}đ`,
    startDate: coupon.createdAt
      ? new Date(coupon.createdAt).toISOString().split("T")[0]
      : "",
    endDate: "", // Không có trong schema
    minOrderValue: coupon.minOrderValue,
    maxDiscount: coupon.maxDiscountAmount,
    quantity: 10, // Max usage
    used: 10 - coupon.remainingUsage,
    status: coupon.status,
  }));

  // Pagination
  const pageData = transformedCoupons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Tính toán các thống kê
  const totalCoupons = transformedCoupons.length;
  const activeCoupons = transformedCoupons.filter(
    (c) => c.status === "active"
  ).length;
  const inactiveCoupons = transformedCoupons.filter(
    (c) => c.status === "inactive"
  ).length;
  const totalUsed = transformedCoupons.reduce((sum, c) => sum + c.used, 0);

  if (loading && coupons.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

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
            CardDesc={`${totalCoupons} Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#28A745"
            icon={CheckCircleIcon}
            CardHeader="Hoạt động"
            CardDesc={`${activeCoupons} Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#FFC107"
            icon={AccessTimeIcon}
            CardHeader="Sắp hết hạn"
            CardDesc="0 Mã"
          />
          <DashboardCardProduct
            BackgroundColor="#DC3545"
            icon={CancelIcon}
            CardHeader="Không hoạt động"
            CardDesc={`${inactiveCoupons} Mã`}
          />
          <DashboardCardProduct
            BackgroundColor="#6F42C1"
            icon={ConfirmationNumberIcon}
            CardHeader="Đã dùng"
            CardDesc={`${totalUsed} Lần`}
          />
        </div>

        <TableControlProvider
          controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
          controlSelectAll={{ selectedItem, setSelectedItem }}
          couponData={pageData}
          filter={filter}
          setFilter={setFilter}
          controlSelectDetail={{ selectedDetail, setSelectedDetail }}
          selectedCouponId={selectedCouponId}
          setSelectedCouponId={setSelectedCouponId}
        >
          <div className="mt-3 bg-white shadow">
            <TableControl type={"coupon"} />
          </div>

          <div className="mt-3">
            <CustomTable type={"coupon"} />
          </div>

          <TablePagination
            component="div"
            count={transformedCoupons.length}
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
