import React, { useState, useMemo } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import useCoupon from "../../../hooks/useCoupon";
import useCouponStore from "../../../stores/useCouponStore";

const CustomTableCoupon = () => {
  const {
    couponData,
    selectedItem,
    setSelectedItem,
    setSelectedDetail,
    setSelectedCouponId,
    filter,
  } = useTableControl();
  const { updateCoupon, loading } = useCoupon();
  const { coupons } = useCouponStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // ✅ Lọc dữ liệu theo filter
  const filteredCoupons = useMemo(() => {
    return couponData.filter((coupon) => {
      const searchText = (filter?.search || "").toLowerCase();
      const statusFilter = filter?.status || "all";
      const typeFilter = filter?.discountType || "all";

      const matchesSearch =
        coupon.couponCode.toLowerCase().includes(searchText) ||
        coupon.discountDisplay?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || coupon.status === statusFilter;

      const matchesType =
        typeFilter === "all" || coupon.discountType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [couponData, filter]);

  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 100 },
    { id: "couponCode", label: "Mã Giảm Giá", minWidth: 100 },
    { id: "discount", label: "Giá Trị Giảm", minWidth: 100 },
    { id: "minOrder", label: "Đơn Tối Thiểu", minWidth: 100 },
    { id: "maxDiscount", label: "Giảm Tối Đa", minWidth: 100 },

    { id: "status", label: "Trạng Thái", minWidth: 100 },
  ];

  // ✅ Phân trang dựa trên dữ liệu đã lọc
  const paginatedData = filteredCoupons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const rows = paginatedData.map((coupon) =>
    createData(
      coupon._id,
      coupon.couponCode,
      coupon.discountValue,
      coupon.discountType,
      coupon.minOrderValue,
      coupon.maxDiscount,
      coupon.endDate,
      coupon.status
    )
  );

  const handleStatusChange = async (couponId, newStatus) => {
    try {
      const originalCoupon = coupons.find((c) => c._id === couponId);
      if (!originalCoupon) return;

      const updateData = {
        code: originalCoupon.code,
        status: newStatus,
        minOrderValue: originalCoupon.minOrderValue,
        maxDiscountAmount: originalCoupon.maxDiscountAmount,
        remainingUsage: originalCoupon.remainingUsage,
        discountType: originalCoupon.discountType,
      };

      if (originalCoupon.discountType === "percent") {
        updateData.discountPercent = originalCoupon.discountPercent;
        updateData.discountAmount = 0;
      } else {
        updateData.discountAmount = originalCoupon.discountAmount;
        updateData.discountPercent = 0;
      }

      await updateCoupon(couponId, updateData);
      console.log("✅ Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 900 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  backgroundColor: "#fff",
                  borderBottom: "none",
                  fontWeight: 600,
                },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ minWidth: col.minWidth }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody sx={{ "& td": { borderBottom: "none" } }}>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onDoubleClick={() => {
                    setSelectedCouponId(row._id);
                    setSelectedDetail(true);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {col.id === "discount" ? (
                        row.discountType === "percentage" ? (
                          row[col.id] + "%"
                        ) : (
                          row[col.id].toLocaleString("vi-VN") + "₫"
                        )
                      ) : col.id === "minOrder" ? (
                        row[col.id].toLocaleString("vi-VN") + "₫"
                      ) : col.id === "maxDiscount" ? (
                        row[col.id].toLocaleString("vi-VN") + "₫"
                      ) : col.id === "status" ? (
                        <Select
                          value={row.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(row._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          size="small"
                          disabled={loading}
                          sx={{
                            minWidth: 120,
                            backgroundColor:
                              row.status === "active" ? "#d4edda" : "#f8d7da",
                            "& .MuiSelect-select": { padding: "8px 12px" },
                          }}
                        >
                          <MenuItem value="active">
                            <span style={{ color: "#28a745", fontWeight: 500 }}>
                              Hiệu lực
                            </span>
                          </MenuItem>
                          <MenuItem value="inactive">
                            <span style={{ color: "#dc3545", fontWeight: 500 }}>
                              Vô hiệu lực
                            </span>
                          </MenuItem>
                        </Select>
                      ) : col.id === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={selectedItem.includes(row.couponCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItem((prev) => [
                                ...prev,
                                row.couponCode,
                              ]);
                            } else {
                              setSelectedItem((prev) =>
                                prev.filter((o) => o !== row.couponCode)
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        row[col.id]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  Không tìm thấy mã giảm giá nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Pagination theo dữ liệu đã lọc */}
      <TablePagination
        component="div"
        count={filteredCoupons.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[20, 30, 50]}
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </Paper>
  );
};

// Hàm tạo dòng dữ liệu
function createData(
  _id,
  couponCode,
  discount,
  discountType,
  minOrder,
  maxDiscount,
  expiryDate,
  status
) {
  return {
    _id,
    couponCode,
    discount,
    discountType,
    minOrder,
    maxDiscount,
    expiryDate,
    status,
  };
}

export default CustomTableCoupon;
