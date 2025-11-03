import { Container } from "@mui/system";
import Navbar from "../../components/Navbar";
import Typography from "@mui/material/Typography";
import { DashboardCardProduct } from "../../components/DashboardCard";
import ShoesIcon from "../../assets/svg/shoes-7-svgrepo-com.svg?react";
import SandalsIcon from "../../assets/svg/pair-of-flip-flop-svgrepo-com.svg?react";
import BackpackIcon from "@mui/icons-material/Backpack";
import TableControlCategory from "../../components/TableControl/TableControlCategory";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useCategoryStore from "../../../stores/useCategoryStore";
import { toast } from "react-toastify";

const Category = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  //State của các category được chọn để xóa
  const [selectedItem, setSelectedItem] = useState([]);

  const axiosPrivate = useAxiosPrivate();
  const {
    setShoeCategories,
    setSandalCategories,
    setBackpackCategories,
    shoeCategories,
    sandalCategories,
    backPackCategories,
  } = useCategoryStore();

  const fetchCategories = async () => {
    try {
      const [shoeRes, sandalRes, backpackRes] = await Promise.all([
        axiosPrivate.get("/api/category/shoe"),
        axiosPrivate.get("/api/category/sandal"),
        axiosPrivate.get("/api/category/backpack"),
      ]);

      setShoeCategories(shoeRes.data.categories);
      setSandalCategories(sandalRes.data.categories);
      setBackpackCategories(backpackRes.data.categories);
    } catch (error) {
      console.log(error);
      toast.error("Tải dữ liệu danh mục thất bại");
    }
  };

  // Load tất cả dữ liệu category khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  //Sự kiện nếu xác nhận xóa
  const handleConfirmDelete = async () => {
    try {
      const res = await axiosPrivate.delete("/api/category/delete", {
        data: { listId: selectedItem },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedItem([]);
      }

      await fetchCategories();
    } catch (error) {
      console.log(error);
      toast.error("Xóa không thành công");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <Navbar active="category" />
      <Container
        disableGutters
        sx={{
          paddingLeft: "38px",
          paddingRight: "64px",
        }}
      >
        <ConfirmDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => handleConfirmDelete()}
          content={`Bạn có muốn xóa ${selectedItem.length} đơn hàng này?`}
          action={"Xóa"}
        />
        <div className="mt-3">
          <Typography variant="body1" color="text.primary">
            OVERVIEW
          </Typography>
          <Typography variant="h4" fontSize={26} fontWeight={500}>
            Trang Danh Mục
          </Typography>
        </div>

        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <DashboardCardProduct
            CardHeader={shoeCategories.length}
            CardDesc="Danh Mục Con Giày"
            icon={ShoesIcon}
            BackgroundColor={"#000B58"}
          />
          <DashboardCardProduct
            CardHeader={sandalCategories.length}
            CardDesc="Danh Mục Con Dép"
            icon={SandalsIcon}
            BackgroundColor={"#006A67"}
          />
          <DashboardCardProduct
            CardHeader={backPackCategories.length}
            CardDesc="Danh Mục Con Ba-lô"
            icon={BackpackIcon}
          />
        </div>

        <div className="mt-3">
          <TableControlCategory
            setConfirmDelete={setConfirmDelete}
            selectedItem={selectedItem}
          />
        </div>

        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <CustomTable
            type={"category-shoe"}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <CustomTable
            type={"category-sandal"}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <CustomTable
            type={"category-bag"}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </Container>
    </>
  );
};

export default Category;
