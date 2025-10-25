import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomDropdown from "../CustomDropdown";

const CustomTableCoupon = () => {
  const { couponData } = useTableControl();
  const { selectedItem, setSelectedItem } = useTableControl();
  const { setSelectedDetail } = useTableControl();

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
      coupon.couponCode,
      coupon.discountValue,
      coupon.minOrderValue,
      coupon.maxDiscount,
      coupon.endDate,
      coupon.status
    )
  );

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
                    {col.id === "discount" ? (
                      row[col.id].toLocaleString("vi-VN") + "₫"
                    ) : col.id === "minOrder" ? (
                      row[col.id].toLocaleString("vi-VN") + "₫"
                    ) : col.id === "maxDiscount" ? (
                      row[col.id].toLocaleString("vi-VN") + "₫"
                    ) : col.id === "status" ? (
                      <CustomDropdown type="coupon" choose={row[col.id]} />
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
  couponCode,
  discount,
  minOrder,
  maxDiscount,
  expiryDate,
  status
) {
  return { couponCode, discount, minOrder, maxDiscount, expiryDate, status };
}

export default CustomTableCoupon;
