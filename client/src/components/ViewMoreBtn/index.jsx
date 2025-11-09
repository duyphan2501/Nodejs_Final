import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const ViewMoreBtn = () => {
  return (
    <Button component={Link} to={"/products"} className="!normal-case !border-b-2 !rounded-none !text-[16px] !p-0 !text-black">
      Xem Thêm
    </Button>
  );
};

export default ViewMoreBtn;
