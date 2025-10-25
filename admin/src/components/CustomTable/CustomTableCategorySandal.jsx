import { use, useState } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../CustomModal";
import { Pagination } from "@mui/material";

export default function CustomTableCategorySandal() {
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
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/89bdb689-2e3d-4ef6-9db1-016c83d45972/victori-one-slides-sandals-4RjX4s.png",
      name: "Nike Victori One Slides",
    },
    {
      id: 2,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a60e1de4-f54c-4b1e-bdb8-27a0ddf38d4f/benassi-jdi-slides-343880-090.png",
      name: "Nike Benassi JDI Slides",
    },
    {
      id: 3,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/59f9a595-b4c9-4a83-87a4-f8a4b26f8a51/air-max-cirro-slides-FbW4hX.png",
      name: "Nike Air Max Cirro Slides",
    },
    {
      id: 4,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ae5488b6-b020-4047-bd3a-0b3c83eea263/calm-slides-DV2N62.png",
      name: "Nike Calm Slides",
    },
    {
      id: 5,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b66e24df-b4d1-47e7-b5f4-fd4f45820f5a/asuna-2-mens-slides-Vh7mHb.png",
      name: "Nike Asuna 2 Slides",
    },
    {
      id: 6,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5cb3ce26-68df-4b83-9d04-59a26553ce42/victori-one-womens-slides-4RjX4s.png",
      name: "Nike Victori One Women’s Slides",
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
