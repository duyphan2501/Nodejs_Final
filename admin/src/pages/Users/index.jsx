// src/pages/Users/index.jsx
import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import { Typography, CircularProgress } from "@mui/material";
import TableControl from "../../components/TableControl";
import { TableControlProvider } from "../../components/TableControl/TableControllerContext";
import { useState, useEffect, useRef, useCallback } from "react";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { TablePagination } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();

  const [userData, setUserData] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    status: "",
    isAdmin: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  // useCallback để tránh recreate function mỗi lần render
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("api/user", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: filter.search || "",
          status: filter.status || "",
          isAdmin: filter.isAdmin || "",
          sortBy: filter.sortBy || "createdAt",
          sortOrder: filter.sortOrder || "desc",
        },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        setUserData(response.data.data || []);
        setTotalUsers(response.data.pagination?.total || 0);
      } else {
        setUserData([]);
        setTotalUsers(0);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi khi tải dữ liệu";
      toast.error(errorMessage);
      console.error("Error fetching users:", error);
      setUserData([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [
    axiosPrivate,
    page,
    rowsPerPage,
    filter.search,
    filter.status,
    filter.isAdmin,
    filter.sortBy,
    filter.sortOrder,
  ]);

  // Effect để gọi API khi dependencies thay đổi
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    try {
      const response = await axiosPrivate.patch("api/user/bulk-update-status", {
        userIds: selectedItem,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(
          response.data.message ||
            `Đã cập nhật ${selectedItem.length} người dùng`
        );
        setSelectedItem([]);
        setConfirmDelete(false);
        fetchUsers();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi khi cập nhật";
      toast.error(errorMessage);
      console.error("Error bulk updating status:", error);
    }
  };

  const handleRowDoubleClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedDetail(true);
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleBulkUpdateStatus("inactive")}
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
            controlSelectDetail={{
              selectedDetail,
              setSelectedDetail,
              selectedUserId,
              setSelectedUserId,
            }}
            refreshData={fetchUsers}
            onRowDoubleClick={handleRowDoubleClick}
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
