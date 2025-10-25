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

const Users = () => {
  const [userData, setUserData] = useState([
    {
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      purchasePoint: 120,
      phone: "0912345678",
      status: "active",
      isAdmin: false,
    },
    {
      name: "Tran Thi B",
      email: "tranthib@example.com",
      purchasePoint: 450,
      phone: "0987654321",
      status: "active",
      isAdmin: true,
    },
    {
      name: "Le Hoang C",
      email: "lehoangc@example.com",
      purchasePoint: 75,
      phone: "0901122334",
      status: "inactive",
      isAdmin: false,
    },
    {
      name: "Pham Duy D",
      email: "phamduyd@example.com",
      purchasePoint: 230,
      phone: "0977123456",
      status: "active",
      isAdmin: false,
    },
    {
      name: "Do Thi E",
      email: "dothie@example.com",
      purchasePoint: 0,
      phone: "0933445566",
      status: "inactive",
      isAdmin: true,
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
  const pageData = userData.slice(
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
        content={"Bạn có muốn đổi trạng thái người dùng này?"}
        action={"Đổi"}
      />
      <Navbar active="orders" />
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <div className="mt-3 mb-3">
          <Typography variant="body1" color="text.primary">
            OVERVIEW
          </Typography>
          <Typography variant="h4" fontSize={26} fontWeight={500}>
            Trang Người Dùng
          </Typography>
        </div>

        <TableControlProvider
          controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
          controlSelectAll={{ selectedItem, setSelectedItem }}
          userData={pageData}
          filter={filter}
          setFilter={setFilter}
          controlSelectDetail={{ selectedDetail, setSelectedDetail }}
        >
          <div className="mt-3 bg-white shadow">
            <TableControl type={"user"} />
          </div>

          <div className="mt-3">
            <CustomTable type={"user"} />
          </div>

          <TablePagination
            component="div"
            count={userData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 30]}
            labelRowsPerPage="Số dòng mỗi trang"
          />

          <CustomModal type={"users"} />
        </TableControlProvider>
      </Container>
    </>
  );
};

export default Users;
