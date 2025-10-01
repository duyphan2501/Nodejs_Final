import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const ViewMoreBtn = ({children, href}) => {
  return (
    <Button components={Link} to={href} className="!normal-case !border-b-2 !rounded-none !text-[16px] !p-0 !text-black">
      {children}
    </Button>
  );
};

export default ViewMoreBtn;
