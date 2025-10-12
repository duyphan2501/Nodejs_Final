import { use, useState } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../CustomModal";

export default function CustomTableCategoryShoe() {
  const columns = [
    { id: "checkbox", label: "Chọn", minWidth: 20 },
    { id: "image", label: "Hình Ảnh", minWidth: 80 },
    { id: "name", label: "Tên", minWidth: 120 },
    { id: "edit", label: "Sửa", minWidth: 20 },
  ];

  const [dataCategory, setDataCategory] = useState([
    {
      id: 1,
      image: "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      name: "Nike Air Force 1 Collection",
    },
    {
      id: 2,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0e92f6fd-539b-4d0f-9fda-3e18d305d31b/air-jordan-1-mid-shoes-86f1ZW.png",
      name: "Air Jordan 1 Series",
    },
    {
      id: 3,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/78b74ac1-efb8-48a7-8a55-97acb2a33b6e/air-max-270-shoes-KkLcGR.png",
      name: "Nike Air Max Collection",
    },
    {
      id: 4,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1f96b6bb-b94e-4e1c-a6c5-7b06e707c90f/pegasus-41-road-running-shoes-VN7B8m.png",
      name: "Nike Pegasus Running Shoes",
    },
    {
      id: 5,
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1f96b6bb-b94e-4e1c-a6c5-7b06e707c90f/pegasus-41-road-running-shoes-VN7B8m.png",
      name: "Nike Chunky",
    },
  ]);
  const [selectedAll, setSelectedAll] = useState([]);
  const [checkboxAll, setCheckboxAll] = useState(false);
  const [editModal, setEditModal] = useState(null);

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

      <h1 className="text-2xl font-semibold mb-3">Giày</h1>

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
          {dataCategory.map((row) => (
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
    </div>
  );
}
