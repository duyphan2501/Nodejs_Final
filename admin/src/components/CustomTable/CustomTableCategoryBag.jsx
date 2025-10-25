import { use, useState } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../CustomModal";
import { Pagination } from "@mui/material";

export default function CustomTableCategoryBag() {
  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 20 },
    { id: "image", label: "Hình Ảnh", minWidth: 80 },
    { id: "name", label: "Tên", minWidth: 120 },
    { id: "edit", label: "Sửa", minWidth: 20 },
  ];

  const [dataCategory, setDataCategory] = useState([
    {
      id: 1,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ddf20d05-8ee1-467a-9c13-bbb62c1e2d48/brasilia-9-5-training-backpack-24l-7p3xC1.png",
      name: "Nike Brasilia 9.5 Training Backpack",
    },
    {
      id: 2,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e401de48-bb75-4ac2-8a31-41b417ad7df9/heritage-backpack-25l-CTk5KH.png",
      name: "Nike Heritage Backpack",
    },
    {
      id: 3,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0abf37ec-fb02-4d91-a893-88e6ab7d825e/hayward-2-0-backpack-26l-RXkXwL.png",
      name: "Nike Hayward 2.0 Backpack",
    },
    {
      id: 4,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3fa4c7c5-4ad7-4e70-8c7c-31de36dd61f1/hoops-elite-backpack-32l-F1sB2F.png",
      name: "Nike Hoops Elite Backpack",
    },
    {
      id: 5,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9c5d9d55-57b2-47d0-912b-1461e569b6e9/utility-speed-backpack-27l-DFNs6L.png",
      name: "Nike Utility Speed Backpack",
    },
    {
      id: 6,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/feebdf2c-0ec7-4d73-83b3-1b9cb54c83c7/sportswear-futura-365-mini-backpack-7l-xkQx1L.png",
      name: "Nike Sportswear Futura 365 Mini Backpack",
    },
  ]);

  const [selectedAll, setSelectedAll] = useState([]);
  const [checkboxAll, setCheckboxAll] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRow = dataCategory.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectAll = () => {
    if (checkboxAll) {
      setSelectedAll([]);
      setCheckboxAll(false);
    } else {
      setCheckboxAll(true);
      setSelectedAll(dataCategory.map((category) => category.id));
    }
  };

  const handleChangeSelect = (id) => {
    if (selectedAll.includes(id)) {
      setSelectedAll((prev) => prev.filter((c) => c !== id));
    } else {
      setSelectedAll((prev) => [...prev, id]);
    }
  };

  return (
    <div className="bg-white shadow p-3 rounded-lg overflow-auto">
      <CustomModal
        type={"category"}
        controlEditModal={{ editModal, setEditModal }}
      />

      <h1 className="text-2xl font-semibold mb-3">Ba lô</h1>

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
                    onChange={() => handleSelectAll()}
                  />
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentRow.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.id} className="p-2 text-sm">
                  {col.id === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={selectedAll.includes(row.id)}
                      onChange={() => handleChangeSelect(row.id)}
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
                        setEditModal({ name: row.name, id: row.id })
                      }
                    >
                      <EditIcon />
                    </Button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-content mt-4 mb-2">
        <Pagination
          count={Math.ceil(dataCategory.length / rowsPerPage)} // tổng số trang
          page={page} // trang hiện tại
          onChange={handleChangePage} // sự kiện đổi trang
          color="primary"
          variant="outlined"
        />
      </div>
    </div>
  );
}
