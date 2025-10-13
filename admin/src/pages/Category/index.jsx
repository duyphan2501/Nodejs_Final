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
import { useState } from "react";

const Category = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);

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
          onConfirm={() => console.log("Xóa đơn hàng")}
          content={"Bạn có muốn xóa đơn hàng này?"}
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
            CardHeader="100"
            CardDesc="Danh Mục Con Giày"
            icon={ShoesIcon}
            BackgroundColor={"#000B58"}
          />
          <DashboardCardProduct
            CardHeader="200"
            CardDesc="Danh Mục Con Dép"
            icon={SandalsIcon}
            BackgroundColor={"#006A67"}
          />
          <DashboardCardProduct
            CardHeader="50"
            CardDesc="Danh Mục Con Ba-lô"
            icon={BackpackIcon}
          />
        </div>

        <div className="mt-3">
          <TableControlCategory setConfirmDelete={setConfirmDelete} />
        </div>

        <div className="mt-3 grid md:grid-cols-3 gap-3">
          <CustomTable type={"category-shoe"} />
          <CustomTable type={"category-sandal"} />
          <CustomTable type={"category-bag"} />
        </div>
      </Container>
    </>
  );
};

export default Category;
