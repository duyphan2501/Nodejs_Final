// src/pages/Users/index.jsx
import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography, CircularProgress } from "@mui/material";
import TableControl from "../../components/TableControl";
import { TableControlProvider } from "../../components/TableControl/TableControllerContext";
import { useState, useEffect } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { TablePagination } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import { getUsers, bulkUpdateStatus } from "../../../API/userAPI.js";
import { toast } from "react-toastify";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [filter, setFilter] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users từ API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: page + 1, // Backend dùng page bắt đầu từ 1
        limit: rowsPerPage,
        search: filter.search || '',
        status: filter.status || '',
        isAdmin: filter.isAdmin || '',
        sortBy: filter.sortBy || 'createdAt',
        sortOrder: filter.sortOrder || 'desc'
      });

      console.log('API Response:', response); // Debug

      // Kiểm tra cấu trúc response
      if (response && response.success) {
        setUserData(response.data || []);
        setTotalUsers(response.pagination?.total || 0);
      } else {
        setUserData([]);
        setTotalUsers(0);
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching users:', error);
      setUserData([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi filter/page thay đổi
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filter]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Xử lý bulk update status
  const handleBulkUpdateStatus = async (newStatus) => {
    try {
      const userIds = selectedItem; // selectedItem chứa array các email/id
      await bulkUpdateStatus(userIds, newStatus);
      
      toast.success(`Đã cập nhật ${userIds.length} người dùng`);
      setSelectedItem([]);
      setConfirmDelete(false);
      
      // Refresh danh sách
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
      console.error('Error bulk updating status:', error);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleBulkUpdateStatus('inactive')}
        content={"Bạn có muốn đổi trạng thái người dùng này?"}
        action={"Đổi"}
      />
      
      <Navbar active="users" />
      
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

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <CircularProgress />
          </div>
        ) : (
          <TableControlProvider
            controlConfirmDelete={{ confirmDelete, setConfirmDelete }}
            controlSelectAll={{ selectedItem, setSelectedItem }}
            userData={userData}
            filter={filter}
            setFilter={setFilter}
            controlSelectDetail={{ selectedDetail, setSelectedDetail }}
            refreshData={fetchUsers}
          >
            <div className="mt-3 bg-white shadow">
              <TableControl type={"user"} />
            </div>

            <div className="mt-3">
              <CustomTable type={"user"} />
            </div>

            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[20, 30, 50]}
              labelRowsPerPage="Số dòng mỗi trang"
            />

            <CustomModal type={"users"} onSuccess={fetchUsers} />
          </TableControlProvider>
        )}
      </Container>
    </>
  );
};

export default Users;