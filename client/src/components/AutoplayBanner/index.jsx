import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StackButton from "../StackButton";

const banners = [
  {
    title: "ADIZERO EVO SL",
    subtitle: "Evo SL mang đến cho bạn tốc độ nhanh",
    image:
      "https://plus.unsplash.com/premium_photo-1667762240906-3227a30e0fc2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXMlMjBiYW5uZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "ADIZERO EVO SL",
    subtitle: "Evo SL mang đến cho bạn tốc độ nhanh",
    image:
      "https://images.unsplash.com/photo-1570348272490-7d6d5fddf335?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "ADIZERO EVO SL",
    subtitle: "Evo SL mang đến cho bạn tốc độ nhanh",
    image:
      "https://plus.unsplash.com/premium_photo-1728989982729-342973fc691e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2hvZXMlMjBiYW5uZXJ8ZW58MHx8MHx8fDA%3D",
  },
];

export default function AutoplayBanner() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          waitForTransition: 1200,
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {banners &&
          banners.map((banner) => (
            <SwiperSlide key={banners.title}>
              <div className="h-150 relative">
                <img
                  src={banner.image}
                  alt=""
                  className="size-full object-cover z-10"
                />
                <div className="absolute z-20 left-10    lg:left-30 bottom-20 space-y-3">
                  <h4 className="title text-2xl bg-white w-fit px-2 font-black">
                    {banner.title}
                  </h4>
                  <h6 className="bg-white w-fit px-2 italic">
                    {banner.subtitle}
                  </h6>
                  <StackButton label={"Mua Ngay"} />
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
