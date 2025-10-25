import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomDropdown from "../CustomDropdown";

const CustomTableOrder = () => {
  const { orderData } = useTableControl();
  const { selectedItem, setSelectedItem } = useTableControl();
  const { setSelectedDetail } = useTableControl();

  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 100 },
    { id: "orderCode", label: "Mã Đơn Hàng", minWidth: 100 },
    { id: "date", label: "Thời Gian", minWidth: 100 },
    { id: "amount", label: "Số Lượng Tổng", minWidth: 100 },
    { id: "payment", label: "Phương Thức", minWidth: 100 },
    { id: "coupon", label: "Mã Giảm Giá", minWidth: 100 },
    { id: "totalPrice", label: "Tổng Tiền", minWidth: 100 },
    { id: "status", label: "Trạng Thái", minWidth: 100 },
  ];

  // Tạo rows từ orderData
  const rows = orderData.map((order) => {
    const totalQuantity = order.products?.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    return createData(
      order.orderCode,
      order.dateCreate,
      totalQuantity,
      order.payment.provider || "Chưa xác định",
      order.couponCode || "-",
      order.totalPrice || 100000,
      order.status
    );
  });

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
                onDoubleClick={() => setSelectedDetail(true)}
                hover
                key={index}
                sx={{ cursor: "pointer" }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === "totalPrice" ? (
                      row[col.id].toLocaleString("vi-VN") + "₫"
                    ) : col.id === "status" ? (
                      <CustomDropdown type="order" choose={row[col.id]} />
                    ) : col.id === "checkbox" ? (
                      <input
                        className="w-20"
                        type="checkbox"
                        checked={selectedItem.includes(row.orderCode)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItem((prev) => [...prev, row.orderCode]);
                          } else {
                            setSelectedItem((prev) =>
                              prev.filter((o) => o !== row.orderCode)
                            );
                          }
                        }}
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

// Hàm tạo dữ liệu row
function createData(
  orderCode,
  date,
  amount,
  payment,
  coupon,
  totalPrice,
  status
) {
  return { orderCode, date, amount, payment, coupon, totalPrice, status };
}

export default CustomTableOrder;
