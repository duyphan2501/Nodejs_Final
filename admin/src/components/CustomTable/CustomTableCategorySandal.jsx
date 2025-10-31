import { useState } from "react";
import { Button, Pagination } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../CustomModal";
import useCategoryStore from "../../../stores/useCategoryStore";

export default function CustomTableCategorySandal({
  selectedItem,
  setSelectedItem,
}) {
  const { sandalCategories, searchTerm } = useCategoryStore();

  // Lọc dữ liệu theo searchTerm
  const filteredData =
    sandalCategories?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 20 },
    { id: "image", label: "Hình Ảnh", minWidth: 80 },
    { id: "name", label: "Tên", minWidth: 120 },
    { id: "edit", label: "Sửa", minWidth: 20 },
  ];

  const [checkboxAll, setCheckboxAll] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRow = filteredData.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleSelectAll = () => {
    if (checkboxAll) {
      setSelectedItem((prev) =>
        prev.filter((id) => !filteredData.some((el) => el._id === id))
      );
      setCheckboxAll(false);
    } else {
      setCheckboxAll(true);
      setSelectedItem((prev) => [
        ...prev,
        ...filteredData.map((category) => category._id),
      ]);
    }
  };

  const handleChangeSelect = (id) => {
    if (selectedItem.includes(id)) {
      setSelectedItem((prev) => prev.filter((c) => c !== id));
    } else {
      setSelectedItem((prev) => [...prev, id]);
    }
  };

  return (
    <div className="bg-white shadow p-3 rounded-lg overflow-auto">
      <CustomModal
        type="category"
        controlEditModal={{ editModal, setEditModal }}
      />

      <h1 className="text-2xl font-semibold mb-3">Dép</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.id}
                className="text-left text-sm font-semibold p-2"
                style={{ minWidth: col.minWidth }}
              >
                {col.id === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={checkboxAll}
                    onChange={handleSelectAll}
                  />
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentRow.length > 0 ? (
            currentRow.map((row) => (
              <tr
                key={row._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td key={col.id} className="p-2 text-sm">
                    {col.id === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={selectedItem.includes(row._id)}
                        onChange={() => handleChangeSelect(row._id)}
                      />
                    ) : col.id === "image" ? (
                      <img
                        src={row.image}
                        alt={row.name}
                        width={60}
                        className="rounded-md"
                      />
                    ) : col.id === "name" ? (
                      row.name
                    ) : col.id === "edit" ? (
                      <Button
                        sx={{ color: "#FFD6A5" }}
                        size="small"
                        onClick={() =>
                          setEditModal({ name: row.name, id: row._id })
                        }
                      >
                        <EditIcon />
                      </Button>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-2">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {currentRow.length > 0 && (
        <div className="flex justify-center mt-4 mb-2">
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            variant="outlined"
          />
        </div>
      )}
    </div>
  );
}
