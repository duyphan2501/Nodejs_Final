import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const MainBanner = () => {
  return (
    <section className="h-156 relative">
      <div className="size-full flex ">
        <img
          src="https://images.unsplash.com/photo-1650301312852-7d009eaa5b0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8"
          alt=""
          className=" h-full flex-1 object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1738041530614-c7bdfb7027ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8"
          alt=""
          className=" h-full flex-1 object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1604327538197-ecc8a394200e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8"
          alt=""
          className=" h-full flex-1 object-cover"
        />
      </div>
      <div className="absolute z-10 w-full h-1/2 inset-0 items-center flex justify-center ">
        <h2 className="title text-7xl font-bold text-primary">Black Fridays</h2>
      </div>
      <div className="absolute z-20 lg:left-30 bottom-20 w-full lg:w-1/3 flex flex-col gap-4 items-center lg:items-baseline">
        <h3 className="subtitle text-xl md:text-2xl font-semibold text-secondary uppercase bg-white rounded-tl-4xl rounded-br-4xl py-2 px-4 max-w-fit whitespace-nowrap">
          Giảm giá ngay hôm nay
        </h3>
        <p className="text-white text-sm text-center lg:text-start w-100 sm:w-110">
          Khám phá những đôi giày hot nhất mùa này. Phong cách – thoải mái – phù
          hợp cho mọi bước chân.
        </p>
        <div className="flex gap-3">
          <Button
            component={Link}
            to={"/products/"}
            className=" p-2 !bg-white !rounded-lg !text-black hover:!bg-secondary hover:!text-white"
          >
            Mua sắm ngay <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
