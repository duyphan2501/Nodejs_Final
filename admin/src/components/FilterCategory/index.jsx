import { useEffect, useState } from "react";
import useCategoryStore from "../../../stores/useCategoryStore";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import BiLoader from "../BiLoader";

const FilterCategory = ({ handleChangeInput }) => {
  const shoeCategories = useCategoryStore((s) => s.shoeCategories);
  const sandalCategories = useCategoryStore((s) => s.sandalCategories);
  const backPackCategories = useCategoryStore((s) => s.backPackCategories);
  const getCategories = useCategoryStore((s) => s.getCategories);

  const [filters, setFilters] = useState({});

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const data = {
    shoes: shoeCategories,
    sandals: sandalCategories,
    backpacks: backPackCategories,
    others: ["Còn hàng", "Hết hàng"],
  };

  useEffect(() => {
    if (
      shoeCategories.length > 0 &&
      sandalCategories.length > 0 &&
      backPackCategories.length > 0
    ) {
      setFilters((prev) => ({
        shoes: prev?.shoes || [],
        sandals: prev?.sandals || [],
        backpacks: prev?.backpacks || [],
        others: prev?.others || [],
      }));
    }
  }, [shoeCategories, sandalCategories, backPackCategories, setFilters]);

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const alreadyChecked = prev[type].includes(value);
      const newFilters = {
        ...prev,
        [type]: alreadyChecked
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
      handleChangeInput("filters", newFilters);

      return newFilters;
    });
  };

  if (
    !filters ||
    !filters.shoes ||
    !filters.sandals ||
    !filters.backpacks ||
    !filters.others
  ) {
    return (
      <div className="flex justify-center items-center">
        <BiLoader size={100} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2 overflow-auto">
      {/* Giày */}
      <div className="shoe-filter border-r p-2 bg-white">
        <h5 className="font-bold capitalize mb-1">Danh mục giày</h5>
        <FormGroup>
          {data.shoes.map((item) => (
            <FormControlLabel
              key={item._id}
              control={
                <Checkbox
                  checked={filters.shoes.includes(item._id)}
                  onChange={() => handleCheckboxChange("shoes", item._id)}
                  size="small"
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
      </div>

      {/* Dép */}
      <div className="sandal-filter border-r p-2 bg-white">
        <h5 className="font-bold capitalize mb-1">Danh mục dép</h5>
        <FormGroup>
          {data.sandals.map((item) => (
            <FormControlLabel
              key={item._id}
              control={
                <Checkbox
                  checked={filters.sandals.includes(item._id)}
                  onChange={() => handleCheckboxChange("sandals", item._id)}
                  size="small"
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
      </div>

      {/* Ba lô */}
      <div className="backpack-filter border-r p-2 bg-white">
        <h5 className="font-bold capitalize mb-1">Danh mục ba lô</h5>
        <FormGroup>
          {data.backpacks.map((item) => (
            <FormControlLabel
              key={item._id}
              control={
                <Checkbox
                  checked={filters.backpacks.includes(item._id)}
                  onChange={() => handleCheckboxChange("backpacks", item._id)}
                  size="small"
                />
              }
              label={item.name}
            />
          ))}
        </FormGroup>
      </div>

      {/* Khác */}
      <div className="other-filter border-r p-2 rounded-lg bg-white">
        <h5 className="font-bold capitalize mb-1">Khác</h5>
        <FormGroup>
          {data.others.map((item) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  checked={filters.others.includes(item)}
                  onChange={() => handleCheckboxChange("others", item)}
                  size="small"
                />
              }
              label={item}
            />
          ))}
        </FormGroup>
      </div>
    </div>
  );
};

export default FilterCategory;
