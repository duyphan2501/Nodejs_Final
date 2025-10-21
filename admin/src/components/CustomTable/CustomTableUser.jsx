import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomDropdown from "../CustomDropdown";
import ToggleButton from "../ToggleButton";

const CustomTableUser = () => {
  const { userData } = useTableControl();
  const { selectedItem, setSelectedItem } = useTableControl();
  const { setSelectedDetail } = useTableControl();

  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 100 },
    { id: "name", label: "Họ Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "phone", label: "Số Điện Thoại", minWidth: 100 },
    { id: "isAdmin", label: "Admin", minWidth: 100 },
    { id: "status", label: "Trạng Thái", minWidth: 100 },
  ];

  // Tạo rows từ userData
  const rows = userData.map((user) => {
    return createData(
      user.name,
      user.email,
      user.phone,
      user.isAdmin,
      user.status
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
                    {col.id === "phone" ? (
                      row[col.id].slice(0, 3) +
                      "****" +
                      row[col.id].slice(7, 10)
                    ) : col.id === "status" ? (
                      <CustomDropdown type="user" choose={row[col.id]} />
                    ) : col.id === "checkbox" ? (
                      <input
                        className="w-20"
                        type="checkbox"
                        checked={selectedItem.includes(row.email)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItem((prev) => [...prev, row.email]);
                          } else {
                            setSelectedItem((prev) =>
                              prev.filter((u) => u !== row.email)
                            );
                          }
                        }}
                      />
                    ) : col.id === "isAdmin" ? (
                      <ToggleButton isEnable={row[col.id]} />
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
function createData(name, email, phone, isAdmin, status) {
  return { name, email, phone, isAdmin, status };
}

export default CustomTableUser;
