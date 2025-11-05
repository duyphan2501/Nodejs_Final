import { useTableControl } from "../TableControl/TableControllerContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CustomDropdown from "../CustomDropdown/CustomDropdownUser";
import ToggleButton from "../ToggleButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";

const CustomTableUser = () => {
  const {
    userData,
    selectedItem,
    setSelectedItem,
    setSelectedDetail,
    setSelectedUserId,
    fetchUsers, // Hoặc tên function fetch data trong context của bạn
  } = useTableControl();

  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData);

  // Sync local state với prop
  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  const columns = [
    { id: "name", label: "Họ Tên", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "phone", label: "Số Điện Thoại", minWidth: 100 },
    { id: "isAdmin", label: "Admin", minWidth: 100 },
    { id: "status", label: "Trạng Thái", minWidth: 100 },
  ];

  // API: Cập nhật status của user
  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      const response = await axiosPrivate.put(`/api/user/${userId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        // Cập nhật local state
        setLocalUserData((prevData) =>
          prevData.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
        console.log("Cập nhật trạng thái thành công");

        // Nếu có fetchUsers trong context thì gọi để sync data
        if (fetchUsers) {
          fetchUsers();
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // API: Cập nhật isAdmin của user
  const handleAdminToggle = async (userId, currentIsAdmin) => {
    const newIsAdmin = !currentIsAdmin;

    try {
      setLoading(true);
      const response = await axiosPrivate.put(`/api/user/${userId}`, {
        isAdmin: newIsAdmin,
      });

      if (response.data.success) {
        // Cập nhật local state
        setLocalUserData((prevData) =>
          prevData.map((user) =>
            user._id === userId ? { ...user, isAdmin: newIsAdmin } : user
          )
        );
        console.log("Cập nhật quyền admin thành công");

        // Nếu có fetchUsers trong context thì gọi để sync data
        if (fetchUsers) {
          fetchUsers();
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền admin:", error);
      alert("Không thể cập nhật quyền admin. Vui lòng thử lại!");

      // Rollback local state nếu API fail
      setLocalUserData([...userData]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowDoubleClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedDetail(true);
  };

  // Tạo rows từ userData
  const rows = localUserData.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      status: user.status,
    };
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.7)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Đang cập nhật...</div>
        </div>
      )}

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
                onDoubleClick={() => handleRowDoubleClick(row)}
                hover
                key={row._id || index}
                sx={{ cursor: "pointer" }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.id === "phone" ? (
                      row[col.id] ? (
                        row[col.id].slice(0, 3) +
                        "****" +
                        row[col.id].slice(7, 10)
                      ) : (
                        "Không có số"
                      )
                    ) : col.id === "status" ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <CustomDropdown
                          type="user"
                          choose={row[col.id]}
                          userId={row._id}
                          onStatusChange={(newStatus) =>
                            handleStatusChange(row._id, newStatus)
                          }
                        />
                      </div>
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
                              prev.filter((id) => id !== row._id)
                            );
                          }
                        }}
                      />
                    ) : col.id === "isAdmin" ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdminToggle(row._id, row.isAdmin);
                        }}
                      >
                        <ToggleButton isEnable={row[col.id]} />
                      </div>
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

export default CustomTableUser;
