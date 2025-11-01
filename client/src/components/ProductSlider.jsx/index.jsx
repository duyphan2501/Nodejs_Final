import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/scrollbar";

import { Scrollbar } from "swiper/modules";
import ProductItem from "../ProductItem.jsx";
import useUserStore from "../../store/useUserStore.js";
import useCartStore from "../../store/useCartStore.js";

const ProductSlider = ({ products }) => {
  const user = useUserStore((state) => state.user);
  const { addToCart } = useCartStore();

  const handleAddToCart = async (item, quantity) => {
    await addToCart(item, quantity, user?._id)
  }

  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={20}
      scrollbar={{ draggable: true }}
      modules={[Scrollbar]}
      className="productSwiper"
      breakpoints={{
        320: { slidesPerView: 1 },
        520: { slidesPerView: 1.3 },
        740: { slidesPerView: 2 },
        930: { slidesPerView: 2.2 },
        1000: { slidesPerView: 3 },
        1224: { slidesPerView: 4 },
        1260: { slidesPerView: 4.2 },
      }}
    >
      {products &&
        products.map((product) => (
          <SwiperSlide key={product.name}>
            <ProductItem product={product} addCart={(item, quantity) => handleAddToCart(item, quantity)}/>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ProductSlider;
