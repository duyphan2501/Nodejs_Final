import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useCoupon from "../../../hooks/useCoupon";
import useCouponStore from "../../../stores/useCouponStore";

const CustomTableCoupon = () => {
  const {
    couponData,
    selectedItem,
    setSelectedItem,
    setSelectedDetail,
    setSelectedCouponId,
  } = useTableControl();
  const { updateCoupon, loading } = useCoupon();
  const { coupons } = useCouponStore();

  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 100 },
    { id: "couponCode", label: "Mã Giảm Giá", minWidth: 100 },
    { id: "discount", label: "Giá Trị Giảm", minWidth: 100 },
    { id: "minOrder", label: "Đơn Tối Thiểu", minWidth: 100 },
    { id: "maxDiscount", label: "Giảm Tối Đa", minWidth: 100 },
    { id: "expiryDate", label: "Ngày Hết Hạn", minWidth: 100 },
    { id: "status", label: "Trạng Thái", minWidth: 100 },
  ];

  const rows = couponData.map((coupon) =>
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

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = async (couponId, newStatus) => {
    try {
      // Tìm coupon từ store để lấy đầy đủ dữ liệu
      const originalCoupon = coupons.find((c) => c._id === couponId);
      if (!originalCoupon) {
        console.error("Coupon not found");
        return;
      }

      // Chuẩn bị dữ liệu update
      const updateData = {
        code: originalCoupon.code,
        status: newStatus,
        minOrderValue: originalCoupon.minOrderValue,
        maxDiscountAmount: originalCoupon.maxDiscountAmount,
        remainingUsage: originalCoupon.remainingUsage,
        discountType: originalCoupon.discountType,
      };

      // Thêm discountPercent hoặc discountAmount
      if (originalCoupon.discountType === "percent") {
        updateData.discountPercent = originalCoupon.discountPercent;
        updateData.discountAmount = 0;
      } else {
        updateData.discountAmount = originalCoupon.discountAmount;
        updateData.discountPercent = 0;
      }

      // Gọi API update
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

          <TableBody
            sx={{
              "& td": { borderBottom: "none" },
            }}
          >
            {rows.map((row, index) => (
              <TableRow
                onDoubleClick={() => {
                  console.log("🖱️ Clicked coupon ID:", row._id);
                  setSelectedCouponId(row._id);
                  setSelectedDetail(true);
                }}
                hover
                key={index}
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
                          e.stopPropagation(); // Ngăn trigger double click
                          handleStatusChange(row._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()} // Ngăn trigger double click
                        size="small"
                        disabled={loading}
                        sx={{
                          minWidth: 120,
                          backgroundColor:
                            row.status === "active" ? "#d4edda" : "#f8d7da",
                          "& .MuiSelect-select": {
                            padding: "8px 12px",
                          },
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
                        className="w-20"
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

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
