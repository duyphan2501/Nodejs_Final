import { useState, useRef, useEffect } from "react";
import { Modal } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "./BannerSwiper.css";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DoneIcon from "@mui/icons-material/Done";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function BannerSwiper() {
  const [bannerData, setBannerData] = useState([
    {
      id: 1,
      imageUrl:
        "https://i.pinimg.com/736x/46/7d/89/467d89080009380ee74eedaf7daee8c5.jpg",
      link: "/",
    },
    {
      id: 2,
      imageUrl:
        "https://mir-s3-cdn-cf.behance.net/project_modules/disp/77ab3a41957975.57bed1131b3f4.png",
      link: "/",
    },
    {
      id: 3,
      imageUrl:
        "https://u.today/sites/default/files/styles/twitter/public/2024-04/47156.jpg",
      link: "/",
    },
  ]);

  const [editLink, setEditLink] = useState(null);
  const fileRefs = useRef({});

  const handleUploadClick = (id) => {
    fileRefs.current[id]?.click();
  };

  const handleFileChange = (event, id) => {
    const file = event.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);

    setBannerData((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, imageUrl: imageURL } : banner
      )
    );
  };

  return (
    <div className="p-5 mt-7 bg-white shadow rounded-lg">
      <h4 className="w-full text-center text-2xl mb-4 font-semibold">
        Banner Trang Chủ
      </h4>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="banner-swiper"
      >
        {bannerData.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={`Banner ${banner.id}`}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => handleUploadClick(banner.id)}
                className="absolute cursor-pointer top-3 left-3 z-20 p-2 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md transition"
              >
                <FileUploadIcon fontSize="small" />
              </button>

              <button
                onClick={() =>
                  setEditLink({ id: banner.id, link: banner.link })
                }
                className="absolute cursor-pointer top-3 right-3 z-20 p-2 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md transition"
              >
                <EditIcon fontSize="small" />
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={(el) => (fileRefs.current[banner.id] = el)}
              onChange={(e) => handleFileChange(e, banner.id)}
              className="hidden"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <ModalChangeLink
        editLink={editLink}
        setEditLink={setEditLink}
        setBannerData={setBannerData}
      />
    </div>
  );
}

const ModalChangeLink = ({ editLink, setEditLink, setBannerData }) => {
  if (!editLink) return null;

  const handleSave = () => {
    setBannerData((prev) =>
      prev.map((b) =>
        b.id === editLink.id ? { ...b, link: editLink.link } : b
      )
    );
    setEditLink(null);
  };

  return (
    <Modal open={!!editLink} onClose={() => setEditLink(null)}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          minWidth: "80%",
        }}
      >
        <h1 className="text-xl font-semibold mb-3">Thay đổi Link</h1>

        <div className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg"
            value={editLink.link}
            onChange={(e) =>
              setEditLink((prev) => ({ ...prev, link: e.target.value }))
            }
          />

          <button
            onClick={handleSave}
            className="absolute top-1/2 -translate-y-1/2 right-3 p-2 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-md"
          >
            <DoneIcon />
          </button>
        </div>
      </div>
    </Modal>
  );
};
