import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const ImageSlider = ({ images = [], isDetail = false }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const mainSwiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setImageIndex(swiper.activeIndex);
  };

  const handleThumbnailClick = (index) => {
    setImageIndex(index);
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

  return (
    <div>
      {/* --- Hiển thị Swiper ở màn nhỏ (md:hidden) --- */}
      <div className={`block ${isDetail && "sm:hidden"}`}>
        <div className={`${!isDetail && "w-120 "} mb-5`}>
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            className="imageSwiper"
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="w-full">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${image}`}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full max-h-120 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Slider thumbnail */}
        <Swiper slidesPerView={4} spaceBetween={10} className="mySwiper w-100" >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className={`cursor-pointer rounded-md overflow-hidden transition border-2 max-w-20 max-h-20 ${
                index === imageIndex ? "border-black" : "border-transparent"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --- Hiển thị dạng lưới ảnh ở màn md trở lên --- */}
      <div
        className={`hidden sm:grid grid-cols-2 gap-4 max-w-200 mx-auto ${
          !isDetail ? "!hidden" : ""
        }`}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-[200px]">
            <img
              src={`${import.meta.env.VITE_API_URL}/${image}`}
              alt={`Image ${index + 1}`}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
