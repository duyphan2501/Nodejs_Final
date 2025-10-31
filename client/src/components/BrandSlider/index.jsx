import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const BrandSlider = () => {
  const brands = [
    "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_150,w_150/juventus_d_29d6017607.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJA6_I2J62S1XcbvT_ErFj2iQB9xejSixBow&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiLzLLXtpu53F-bxw4xBtyQrAQu7RTLWxeHw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTYBu8vKwkPP6klmevCVU6-WeJmkhV40UIfQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnB64ViYMzT66pwXcwjNUTGaCMlYwjw4uCaQ&s",
  ];

  return (
    <div className="flex items-center justify-center flex-col">
      <h4 className="uppercase text-3xl md:text-4xl font-bold title mb-10">
        Các thương hiệu đồng hành
      </h4>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full max-w-6xl"
      >
        {brands.map((src, idx) => (
          <SwiperSlide key={idx}>
            <Link to="#" className="flex justify-center items-center">
              <img
                src={src}
                alt={`brand-${idx}`}
                className="h-20 w-20 object-contain"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandSlider;
