import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StackButton = ({ label, href }) => {
  return (
    <div className="relative w-fit">
      <Link to={href}>
        <Button
          endIcon={<ArrowRight />}
          className=" !rounded-none !p-3 !absolute -bottom-1 -right-1 !font-semibold !text-black  !bg-black !border-2 !border-white hover:!border-primary"
        >
          {label}
        </Button>
      </Link>
      <Link to={href}>
        <Button
          endIcon={<ArrowRight/>}
          className="!rounded-none text-nowrap !p-3 !font-semibold !text-black !bg-primary !border-2 !border-white hover:!border-black "
        >
          {label}
        </Button>
      </Link>
    </div>
  );
};

export default StackButton;
