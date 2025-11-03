import Navbar from "../../components/Navbar";
import { Container } from "@mui/system";
import { Button } from "@mui/material";
import { DashboardCardProduct } from "../../components/DashboardCard";
import Typography from "@mui/material/Typography";
import ShoesIcon from "../../assets/svg/shoes-7-svgrepo-com.svg?react";
import SandalsIcon from "../../assets/svg/pair-of-flip-flop-svgrepo-com.svg?react";
import BackpackIcon from "@mui/icons-material/Backpack";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { useState, useMemo, use } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ProductList from "../../components/ProductList";
import { Menu } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CategoryPicker from "../../components/CategoryPicker";
import VariantManager from "../../components/VariantManager";
import CustomizedSnackbars from "../../components/test";
import CustomSnackbar from "../../components/CustomSnackbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import TransitionsModal from "../../components/TransitionsModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TiptapEditor from "../../components/TiptapEditor";
import useCategoryStore from "../../../stores/useCategoryStore";
import useFetchCategory from "../../../hooks/useFetchCategory";
import BiLoader from "../../components/BiLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

export default function Products() {
  const [viewMode, setViewMode] = useState("list");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [chooseID, setChooseID] = useState(1);

  const products = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      name: `Nike Shoe ${i + 1}`,
      brand: "Nike",
      price: 2000000 + i * 10000,
      stock: Math.floor(Math.random() * 50),
      totalStock: 100,
      sold: Math.floor(Math.random() * 100),
      image:
        "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
    }));
  }, []); // dependency [] => chỉ chạy 1 lần
  return (
    <div style={{ background: "#F9FAFB" }}>
      <Navbar active="products" />
      <CustomSnackbar
        variant={"filled"}
        severity={"success"}
        content={"Lưu biến thể thành công"}
        openSnackbar={snackbarOpen}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
      />
      ;
      <div className="relative w-full h-450 overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-full h-full overflow-auto scroll-hidden  transition-transform duration-300 ${
            viewMode === "list" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <OverviewProduct
            setViewMode={setViewMode}
            products={products}
            onChooseID={setChooseID}
          />
        </div>

        <div
          className={`absolute top-0 left-0 w-full h-full overflow-scroll transition-transform duration-300 ${
            viewMode === "customize" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <AddProductView
            setViewMode={setViewMode}
            openSnackbar={() => setSnackbarOpen(true)}
          />
        </div>

        <div
          className={`absolute top-0 left-0 w-full h-full overflow-scroll transition-transform duration-300 ${
            viewMode === "edit" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <EditProductView
            setViewMode={setViewMode}
            openSnackbar={() => setSnackbarOpen(true)}
            info={products.find((p) => p.id == chooseID)}
          />
        </div>
      </div>
    </div>
  );
}

function OverviewProduct({ setViewMode, products, onChooseID }) {
  const [anchorAll, setAnchorAll] = useState(null);

  // State for selected product
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectAll = () => {
    setSelectedProducts(products.map((p) => p.id));
    handleCloseAll();
  };

  const handleClearAll = () => {
    setSelectedProducts([]);
    handleCloseAll;
  };

  //Du lieu data mẫu

  const handleOpenAll = (e) => {
    setAnchorAll(e.currentTarget);
  };
  const handleCloseAll = () => {
    setAnchorAll(null);
  };

  return (
    <div style={{ background: "#F9FAFB" }}>
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <div className="mt-3">
          <Typography variant="body1" color="text.primary">
            OVERVIEW
          </Typography>
          <Typography variant="h4" fontSize={26} fontWeight={500}>
            Trang Sản Phẩm
          </Typography>
        </div>

        <div className=" mt-7 grid grid-cols-1  md:grid-cols-3 bg-white gap-4">
          <DashboardCardProduct
            CardHeader="100"
            CardDesc="Giày"
            icon={ShoesIcon}
            BackgroundColor={"#000B58"}
          />
          <DashboardCardProduct
            CardHeader="200"
            CardDesc="Dép"
            icon={SandalsIcon}
            BackgroundColor={"#006A67"}
          />
          <DashboardCardProduct
            CardHeader="50"
            CardDesc="Ba-lô"
            icon={BackpackIcon}
          />
        </div>

        <div className="mt-6 bg-white p-3 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative w-full">
              <input
                type="text"
                className="rounded-full p-2 pl-10 w-full h-full shadow"
                placeholder="Searching"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <SortDropdown />

              <Button
                color="black"
                sx={{
                  background: "#F3F3F3",
                  borderRadius: "100px",
                }}
                padding="20"
                onClick={handleOpenAll}
              >
                <MoreHorizIcon />
              </Button>
              <Menu
                id="all-button"
                aria-labelledby="all-button"
                anchorEl={anchorAll}
                open={Boolean(anchorAll)}
                onClose={handleCloseAll}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleSelectAll}>Chọn tất cả</MenuItem>
                <MenuItem onClick={handleClearAll}>Xóa tất cả</MenuItem>
              </Menu>

              <Button
                color="black"
                sx={{
                  background: "#079CFD",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                }}
                onClick={() => setViewMode("customize")}
              >
                <AddIcon sx={{ color: "white" }} />
                <h6
                  className="capitalize text-center p-3 text-white hidden lg:inline whitespace-nowrap
"
                >
                  Thêm sản phẩm
                </h6>
              </Button>
            </div>
          </div>

          {/* Divider  */}
          <div className="h-px bg-gray-300 w-full mt-5"></div>

          {/* Selection Group  */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <CategoryDropdown />
            <StatusDropdown />
            <StockDropdown />
          </div>
        </div>

        {/* Product List  */}
        <div className="mt-6 mb-12">
          <ProductList
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            chooseToEdit={(id) => {
              setViewMode("edit");
              onChooseID(id);
              console.log(id);
            }}
          />
        </div>
      </Container>
    </div>
  );
}

function AddProductView({ setViewMode, openSnackbar }) {
  //Khai báo store
  const shoeCategories = useCategoryStore((s) => s.shoeCategories);
  const sandalCategories = useCategoryStore((s) => s.sandalCategories);
  const backPackCategories = useCategoryStore((s) => s.backPackCategories);

  const [input, setInput] = useState({});

  const [reset, setReset] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  //Fetch du lieu category tu hook
  const { loadingCategory } = useFetchCategory();

  const dataCategory = [
    {
      _id: 1,
      name: "Giày",
      label: "Giày",
      children: shoeCategories,
    },
    {
      _id: 2,
      name: "Ba lô",
      label: "Ba lô",
      children: backPackCategories,
    },
    {
      _id: 3,
      name: "Phụ Kiện",
      label: "Phụ kiện",
      children: sandalCategories,
    },
  ];

  //Hàm handle Input Form
  const handleChangeInput = (key, value) => {
    setInput((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  //Ham input cho TipTap
  const handleChangeValueDesc = (htmlContext) => {
    handleChangeInput("description", htmlContext);
  };

  //Ham reset input
  const handleReset = () => {
    setReset((prev) => prev + 1);
  };

  //Ham submit de add
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Gửi các field cơ bản
      if (input.name) formData.append("name", input.name);
      if (input.inputPrice) formData.append("inputPrice", input.inputPrice);
      if (input.description) formData.append("description", input.description);

      // Gửi category (nhiều cái)
      if (input.category) {
        Object.keys(input.category).forEach((key) => {
          if (input.category[key]) {
            formData.append("categories[]", key);
          }
        });
      }

      //Chuyen cac size ve so
      input.variant = input.variant.map((v) => ({
        ...v,
        inStock: Object.fromEntries(
          Object.entries(v.inStock).map(([size, quantity]) => [
            size,
            quantity === "" ? 0 : Number(quantity),
          ])
        ),
      }));

      // Gửi variant (mỗi variant có thể có nhiều ảnh)
      if (input.variant && input.variant.length > 0) {
        const savedVariant = input.variant.filter((v) => v.save === true);
        formData.append("variants", JSON.stringify(savedVariant));

        input.variant.forEach((variant, i) => {
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach((img, j) => {
              if (img && img.file) {
                formData.append(`variant_images_${i}_${j}`, img.file);
              }
            });
          }
        });
      }

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Gọi API
      const res = await axiosPrivate.post("/api/product/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Thêm sản phẩm thành công!!");
      setInput({});
      handleReset();
      setViewMode("list");
      setOpenConfirmAdd(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error.response?.data.details);
      const messageErr =
        error.response?.data.message || "Thêm sản phẩm thất bại";
      toast.error(messageErr);
      setOpenConfirmAdd(false);
    }
  };

  console.log(input);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmAdd, setOpenConfirmAdd] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  return (
    <div className="" style={{ background: "#F9FAFB" }}>
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <TransitionsModal
          open={successModal}
          onClose={() => setSuccessModal(false)}
          type={"Thành Công"}
          content={"Đã Thêm Sản Phẩm Vào Kho Hàng"}
          Icon={CheckCircleIcon}
          color={"#43A047"}
        />
        <ConfirmDialog
          content={"Bạn có muốn hủy bỏ thêm sản phẩm?"}
          action={"Đồng ý"}
          onClose={() => setOpenConfirm(false)}
          onConfirm={async () => {
            setInput({});
            handleReset();
            setViewMode("list");
            setOpenConfirm(false);
          }}
          open={openConfirm}
        />

        <ConfirmDialog
          content={"Bạn có muốn thêm sản phẩm?"}
          action={"Đồng ý"}
          onClose={() => setOpenConfirmAdd(false)}
          onConfirm={handleSubmit}
          open={openConfirmAdd}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="">
            <div className="flex items-center gap-4">
              <Typography
                variant="body1"
                color="blue"
                sx={{
                  "&:hover": {
                    color: "#4544EC",
                    cursor: "pointer", // thêm con trỏ tay nếu muốn
                  },
                }}
                onClick={() => setViewMode("list")}
              >
                Danh Sách Sản Phẩm
              </Typography>
              <ArrowForwardIosIcon sx={{ fontSize: "17px" }} />
              <Typography
                variant="body1"
                color="blue"
                sx={{
                  "&:hover": {
                    color: "#4544EC",
                    cursor: "pointer", // thêm con trỏ tay nếu muốn
                  },
                }}
              >
                Thêm Sản Phẩm
              </Typography>
            </div>

            <Typography variant="h4" fontSize={26} fontWeight={500} mt={1}>
              Thêm Sản Phẩm
            </Typography>
          </div>

          <div className="grow"></div>

          <div className="flex gap-3 items-end">
            <Button
              variant="outlined"
              sx={{
                height: "40px",
                border: "1px solid #762222",
                color: "#762222",
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
              onClick={() => setOpenConfirm(true)}
            >
              Hủy Bỏ
            </Button>
            <Button
              variant="contained"
              sx={{
                height: "40px",
                background: "#4544EC",
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
              onClick={() => setOpenConfirmAdd(true)}
            >
              Thêm Sản Phẩm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 gap-5 ">
          <div className="p-4 h-100 overflow-y-scroll lg:col-span-2 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
            <h2 className="text-lg font-semibold capitalize">
              Thông tin tổng quát
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div id="product-name" className="mt-2">
                <p className="text-[#646464]">Tên Sản Phẩm</p>
                <input
                  type="text"
                  className="p-2 w-full bg-[#F5F5F5] shadow border-none focus:outline-none hover:border-none"
                  onChange={(e) => handleChangeInput("name", e.target.value)}
                  value={input.name || ""}
                />
              </div>
              <div id="product-price" className="mt-2">
                <p className="text-[#646464]">Giá Nhập Sản Phẩm</p>
                <input
                  type="number"
                  className="p-2 w-full bg-[#F5F5F5] shadow border-none focus:outline-none hover:border-none"
                  onChange={(e) =>
                    handleChangeInput("inputPrice", e.target.value)
                  }
                  value={input.inputPrice || ""}
                />
              </div>
            </div>

            <div id="product-desc" className="mt-2 h-full">
              <TiptapEditor
                handleChangeValue={handleChangeValueDesc}
                content={input.description || ""}
              />
            </div>
          </div>
          <div className="h-100  p-4 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] overflow-y-scroll">
            <h2 className="text-lg font-semibold">Danh Mục</h2>

            {loadingCategory ? (
              <BiLoader size={20} />
            ) : (
              <CategoryPicker
                dataCategory={dataCategory}
                handleChangeInput={handleChangeInput}
                reset={reset}
              />
            )}
          </div>
        </div>

        <div className="shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] mt-10 p-4">
          <h2 className="text-lg font-semibold capitalize">Biến thể</h2>
          <VariantManager
            openSnackbar={openSnackbar}
            handleChangeInput={handleChangeInput}
            reset={reset}
          />
        </div>
      </Container>
    </div>
  );
}

function EditProductView({ setViewMode, openSnackbar, info }) {
  const dataCategory = [
    {
      id: 1,
      name: "giay",
      label: "Giày",
      children: [
        { id: 11, name: "sport", label: "Sport" },
        { id: 12, name: "nam", label: "Nam" },
        { id: 13, name: "nu", label: "Nữ" },
      ],
    },
    {
      id: 2,
      name: "balo",
      label: "Ba lô",
      children: [
        { id: 21, name: "nam", label: "Nam" },
        { id: 22, name: "nu", label: "Nữ" },
      ],
    },
    {
      id: 3,
      name: "phukien",
      label: "Phụ kiện",
      children: [
        { id: 31, name: "nam", label: "Nam" },
        { id: 32, name: "nu", label: "Nữ" },
        { id: 33, name: "non", label: "Nón" },
      ],
    },
  ];

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmAdd, setOpenConfirmAdd] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [input, setInput] = useState({});

  const handleChangeInput = (key, value) => {
    setInput((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <div className="" style={{ background: "#F9FAFB" }}>
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <TransitionsModal
          open={successModal}
          onClose={() => setSuccessModal(false)}
          type={"Thành Công"}
          content={"Đã Cập Nhật Sản Phẩm Vào Kho Hàng"}
          Icon={CheckCircleIcon}
          color={"#43A047"}
        />
        <ConfirmDialog
          content={"Bạn có muốn hủy bỏ cập nhật sản phẩm?"}
          action={"Đồng ý"}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => {
            setViewMode("list");
            setOpenConfirm(false);
          }}
          open={openConfirm}
        />

        <ConfirmDialog
          content={"Bạn có muốn cập nhật sản phẩm?"}
          action={"Đồng ý"}
          onClose={() => setOpenConfirmAdd(false)}
          onConfirm={() => {
            setViewMode("list");
            setOpenConfirmAdd(false);
            setSuccessModal(true);
          }}
          open={openConfirmAdd}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="">
            <div className="flex items-center gap-4">
              <Typography
                variant="body1"
                color="blue"
                sx={{
                  "&:hover": {
                    color: "#4544EC",
                    cursor: "pointer", // thêm con trỏ tay nếu muốn
                  },
                }}
                onClick={() => setViewMode("list")}
              >
                Danh Sách Sản Phẩm
              </Typography>
              <ArrowForwardIosIcon sx={{ fontSize: "17px" }} />
              <Typography
                variant="body1"
                color="blue"
                sx={{
                  "&:hover": {
                    color: "#4544EC",
                    cursor: "pointer", // thêm con trỏ tay nếu muốn
                  },
                }}
              >
                Cập Nhật Sản Phẩm
              </Typography>
            </div>

            <Typography variant="h4" fontSize={26} fontWeight={500} mt={1}>
              Cập Nhật Sản Phẩm
            </Typography>
          </div>

          <div className="grow"></div>

          <div className="flex gap-3 items-end">
            <Button
              variant="outlined"
              sx={{
                height: "40px",
                border: "1px solid #762222",
                color: "#762222",
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
              onClick={() => setOpenConfirm(true)}
            >
              Hủy Bỏ
            </Button>
            <Button
              variant="contained"
              sx={{
                height: "40px",
                background: "#4544EC",
                fontFamily: '"Be Vietnam Pro", sans-serif',
              }}
              onClick={() => setOpenConfirmAdd(true)}
            >
              Sửa Sản Phẩm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 gap-5 ">
          <div className="p-4 h-100 overflow-y-scroll lg:col-span-2 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
            <h2 className="text-lg font-semibold capitalize">
              Thông tin tổng quát
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div id="product-name" className="mt-2">
                <p className="text-[#646464]">Tên Sản Phẩm</p>
                <input
                  type="text"
                  className="p-2 w-full bg-[#F5F5F5] shadow border-none focus:outline-none hover:border-none"
                  value={info.name}
                />
              </div>
              <div id="product-price" className="mt-2">
                <p className="text-[#646464]">Giá Nhập Sản Phẩm</p>
                <input
                  type="text"
                  className="p-2 w-full bg-[#F5F5F5] shadow border-none focus:outline-none hover:border-none"
                  value={info.inPrice}
                />
              </div>
            </div>

            <div id="product-desc" className="mt-2 h-full">
              <p className="text-[#646464]">Mô Tả</p>
              <textarea
                type="text"
                className="p-2 h-full w-full bg-[#F5F5F5] shadow border-none focus:outline-none hover:border-none "
                value={info.description}
              />
            </div>
          </div>
          <div className="h-100  p-4 rounded-lg shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] overflow-y-scroll">
            <h2 className="text-lg font-semibold">Danh Mục</h2>
            <CategoryPicker
              dataCategory={dataCategory}
              handleChangeInput={handleChangeInput}
            />
          </div>
        </div>

        <div className="shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] mt-10 p-4">
          <h2 className="text-lg font-semibold capitalize">Biến thể</h2>
          <VariantManager
            openSnackbar={openSnackbar}
            handleChangeInput={handleChangeInput}
          />
        </div>
      </Container>
    </div>
  );
}

function CategoryDropdown({ className }) {
  const [category, setCategory] = useState("all");

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <FormControl
      className={className}
      sx={{
        minWidth: 200,
        width: {
          xs: "100%", // màn nhỏ
          sm: "100%", // màn sm trở lên
        },
      }}
    >
      <Select
        labelId="category-select-label"
        value={category}
        onChange={handleChange}
        sx={{
          borderRadius: "12px",
          padding: "0px",
          backgroundColor: "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // tắt border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #707070", // tắt hover border
          },
        }}
      >
        <MenuItem sx={{ textTransform: "capitalize" }} value="all">
          Tất cả danh mục
        </MenuItem>
        <MenuItem sx={{ textTransform: "capitalize" }} value="shoes">
          Giày
        </MenuItem>
        <MenuItem sx={{ textTransform: "capitalize" }} value="sandals">
          Dép
        </MenuItem>
        <MenuItem sx={{ textTransform: "capitalize" }} value="men">
          Nam
        </MenuItem>
        <MenuItem sx={{ textTransform: "capitalize" }} value="women">
          Nữ
        </MenuItem>
        <MenuItem sx={{ textTransform: "capitalize" }} value="backpack">
          Ba-lô
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function StatusDropdown({ className }) {
  const [status, setStatus] = useState("active");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <FormControl
      className={className}
      sx={{
        minWidth: 200,
        width: {
          xs: "100%", // màn nhỏ
          sm: "100%", // màn sm trở lên
        },
      }}
    >
      <Select
        value={status}
        onChange={handleChange}
        sx={{
          borderRadius: "12px",
          padding: "0px",
          fontWeight: "500",
          backgroundColor: "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // tắt border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #707070", // tắt hover border
          },
        }}
      >
        <MenuItem value="active">Được Kích Hoạt</MenuItem>
        <MenuItem value="inactive">Không Kích Hoạt</MenuItem>
      </Select>
    </FormControl>
  );
}

function StockDropdown({ className }) {
  const [stock, setStock] = useState("inStock");

  const handleChange = (event) => {
    setStock(event.target.value);
  };

  return (
    <FormControl
      className={className}
      sx={{
        minWidth: 200,
        width: {
          xs: "100%", // màn nhỏ
          sm: "100%", // màn sm trở lên
        },
      }}
    >
      <Select
        value={stock}
        onChange={handleChange}
        sx={{
          borderRadius: "12px",
          padding: "0px",
          fontWeight: "500",
          backgroundColor: "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // tắt border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #707070", // tắt hover border
          },
        }}
      >
        <MenuItem value="inStock">Còn Hàng</MenuItem>
        <MenuItem value="outOfStock">Hết Hàng</MenuItem>
      </Select>
    </FormControl>
  );
}

function SortDropdown({ className }) {
  const [sort, setSort] = useState("priceAsc");

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <FormControl
      className={className}
      sx={{
        minWidth: 200,
        width: {
          xs: "100%", // màn nhỏ
          sm: "50%", // màn sm trở lên
        },
      }}
    >
      <Select
        value={sort}
        onChange={handleChange}
        sx={{
          height: "100%",
          borderRadius: "12px",
          padding: "0px",
          fontWeight: "500",
          backgroundColor: "#F3F3F3",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // tắt border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #707070", // tắt hover border
          },
        }}
      >
        <MenuItem value="priceAsc">Giá tăng</MenuItem>
        <MenuItem value="priceDesc">Giá giảm</MenuItem>
        <MenuItem value="alphaAsc">A - Z</MenuItem>
        <MenuItem value="alphaDesc">Z - A</MenuItem>
        <MenuItem value="stockAsc">Tồn kho tăng</MenuItem>
        <MenuItem value="stockDesc">Tồn kho giảm</MenuItem>
      </Select>
    </FormControl>
  );
}
