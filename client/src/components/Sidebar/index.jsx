import { useEffect, useMemo, useState } from "react";
import Slider from "@mui/material/Slider";
import CollapseButton from "../CollapseButton";
import { formatMoney } from "../../utils/formatMoney";
import useProductStore from "../../store/useProductStore";
import useCategoryStore from "../../store/useCategoryStore";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import CategoryItem from "../CategoryItem";


const Sidebar = ({filter, handleChangeFilter}) => {
  const { getAllBrands } = useProductStore();
  const { getListCategories } = useCategoryStore();
  const [brandNames, setBrandNames] = useState([]);
  const [categories, setCategories] = useState([]);

  const [value, setValue] = useState([filter.minPrice, filter.maxPrice]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleChangeFilter("minPrice", newValue[0])
    handleChangeFilter("maxPrice", newValue[1])
  };

  const handleCheckBoxChange = (event, field, value) => {
      const isChecked = event.target.checked;
      const current = filter[field] || []; 
  
      let updated;
      if (isChecked) {
          updated = [...current, value]; 
      } else {
          updated = current.filter(id => id !== value); 
      }
      
      handleChangeFilter(field, updated);
  };

  const sliderSx = useMemo(
    () => ({
      // Tùy chỉnh màu của cả thanh và hai đầu
      color: "black",

      // Nhắm đến thumb của slider
      "& .MuiSlider-thumb": {
        // Tùy chỉnh kích thước nhỏ hơn
        width: 10,
        height: 10,

        // Tùy chỉnh bóng đổ khi di chuột qua hoặc focus để nhỏ hơn
        "&:hover, &.Mui-focusVisible": {
          boxShadow: "0 0 0 4px rgba(0, 0, 0, 0.1)",
        },
      },
    }),
    []
  );

  const fetchData = async () => {
    const [categoriesList, brands] = await Promise.allSettled([
      getListCategories(),
      getAllBrands(),
    ]);
    setCategories(categoriesList.value);
    setBrandNames(brands.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="">
      <div className="sidebar flex lg:flex-col justify-center lg:gap-2 gap-5 lg:sticky">
        <CollapseButton title={"Danh mục"}>
          <FormGroup>
            {/* Duyệt qua các danh mục cấp cha (parent level) */}
            {categories.map((category) => (
              <CategoryItem key={category._id} category={category} handleChange={handleCheckBoxChange}/>
            ))}
          </FormGroup>
        </CollapseButton>
        <CollapseButton title={"Thương hiệu"}>
          <FormGroup>
            {brandNames.map((item) => {
              return (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      onChange={e => handleCheckBoxChange(e, "brand", item)}
                      sx={{
                        color: "black", // màu viền khi chưa chọn
                        "&.Mui-checked": {
                          color: "black", // màu tick khi được chọn
                        },
                        "&:hover": {
                          backgroundColor: "rgba(0, 43, 91, 0.08)", // hiệu ứng hover nhẹ
                        },
                      }}
                    />
                  }
                  label={item}
                />
              );
            })}
          </FormGroup>
        </CollapseButton>
      </div>
      <div className="">
        <h4 className="font-semibold font-sans text-xl text-gray-800 title px-2">
          Khoảng giá
        </h4>
        <div className="px-3">
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={10000000}
            step={10000}
            sx={sliderSx}
          />
          <div className="flex font-sans">
            <div className="text-sm">
              Từ
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(value[0])}
              </span>
            </div>
            <div className="text-sm ml-auto">
              Đến
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(value[1])}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
