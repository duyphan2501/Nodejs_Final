import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";

const StackButton = ({ label, theme = "light", icon = null, onClick }) => {
  // Quy định màu theo theme
  const themes = {
    light: {
      mainBg: "!bg-primary !text-black hover:!border-black",
      overlayBg: "!bg-black !text-white hover:!border-primary",
    },
    dark: {
      mainBg: "!bg-black !text-white hover:!bg-black/70",
      overlayBg: "!bg-black !text-black hover:!border-black",
    },
  };

  const current = themes[theme] || themes.light;

  return (
    <div onClick={onClick} className="relative w-fit">
      <Button
        endIcon={icon ? icon : <ArrowRight />}
        className={`!rounded-none !p-3 !absolute -bottom-1 -right-1 !font-semibold !border-2 !border-white ${current.overlayBg}`}
      >
        {label}
      </Button>

      <Button
        endIcon={icon ? icon : <ArrowRight />}
        className={`!rounded-none text-nowrap !p-3 !font-semibold !border-2 !border-white ${current.mainBg}`}
      >
        {label}
      </Button>
    </div>
  );
};

export default StackButton;
