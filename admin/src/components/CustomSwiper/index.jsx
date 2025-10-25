import UserDetailSwiper from "./UserDetailSwiper";
import BannerSwiper from "./BannerSwiper";

const CustomSwiper = ({ type }) => {
  return (
    <>
      {type === "user-detail" && <UserDetailSwiper />}
      {type === "banner" && <BannerSwiper />}
    </>
  );
};

export default CustomSwiper;
