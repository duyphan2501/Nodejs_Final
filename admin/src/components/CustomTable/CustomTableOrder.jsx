import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomDropdown from "../CustomDropdown";
import useOrderStore from "../../../stores/useOrderStore";
import { useEffect, useState } from "react";
import { TablePagination } from "@mui/material";

const CustomTableOrder = () => {
  const orders = useOrderStore((s) => s.orders);
  const getOrders = useOrderStore((s) => s.getOrders);

  useEffect(() => {
    getOrders();
  }, []);

  // const { orderData } = useTableControl();
  const { selectedItem, setSelectedItem } = useTableControl();
  const { setSelectedDetail } = useTableControl();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

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

  //Pagination
  const pageData = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Tạo rows từ orderData
  const rows = pageData.map((order) => {
    const totalQuantity = order.items?.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    const formatDate = (isoDate) => {
      const dateNormal = new Date(isoDate);

      return dateNormal.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return createData(
      order._id,
      order.orderCode,
      formatDate(order.createdAt),
      totalQuantity,
      order?.payment?.provider.toUpperCase() || "Chưa xác định",
      order?.coupon?.code || "-",
      order?.orderAmount || 100000,
      order?.status
    );
  });

  //Pagination
  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  //DU lieu mau

  return (
    <>
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

            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <h5 className="text-xl text-gray-500 py-10">
                      Không có đơn hàng nào
                    </h5>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    onDoubleClick={() => setSelectedDetail(row._id)}
                    hover
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        {col.id === "totalPrice" ? (
                          row[col.id].toLocaleString("vi-VN") + "₫"
                        ) : col.id === "status" ? (
                          <CustomDropdown
                            type="order"
                            choose={row[col.id]}
                            id={row._id}
                          />
                        ) : col.id === "checkbox" ? (
                          <input
                            className="w-20"
                            type="checkbox"
                            checked={selectedItem.includes(row._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItem((prev) => [...prev, row._id]);
                              } else {
                                setSelectedItem((prev) =>
                                  prev.filter((o) => o !== row._id)
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[20, 30]}
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </>
  );
};

// Hàm tạo dữ liệu row
function createData(
  _id,
  orderCode,
  date,
  amount,
  payment,
  coupon,
  totalPrice,
  status
) {
  return {
    _id,
    orderCode,
    date,
    amount,
    payment,
    coupon,
    totalPrice,
    status,
  };
}

export default CustomTableOrder;
