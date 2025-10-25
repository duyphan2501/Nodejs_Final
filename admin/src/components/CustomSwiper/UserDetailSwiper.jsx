import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

export default function UserDetailSwiper() {
  const dataAddresses = [
    {
      name: "Nguyễn Văn A",
      phone: "0905123456",
      address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    },
    {
      name: "Trần Thị B",
      phone: "0987654321",
      address: "45 Nguyễn Huệ, Quận Hải Châu, TP. Đà Nẵng",
    },
    {
      name: "Lê Minh C",
      phone: "0912345678",
      address: "78 Trần Phú, Quận Ba Đình, Hà Nội",
    },
    {
      name: "Phạm Thùy D",
      phone: "0978123456",
      address: "56 Võ Văn Kiệt, Quận Ninh Kiều, Cần Thơ",
    },
    {
      name: "Hoàng Quốc E",
      phone: "0933444555",
      address: "22 Lý Thường Kiệt, TP. Vinh, Nghệ An",
    },
  ];
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {dataAddresses.map((raw, i) => (
        <SwiperSlide key={i}>
          <div className="bg-white p-3 cursor-pointer text-gray-700 border border-gray-300 h-40 flex flex-col gap-2 rounded-xl overflow-auto scroll-hidden">
            <h5 className="font-bold text-xl">{raw.name}</h5>
            <h5 className="text-md">{raw.phone}</h5>
            <h5 className="text-md">{raw.address}</h5>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
