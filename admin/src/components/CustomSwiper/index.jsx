import UserDetailSwiper from "./UserDetailSwiper";

const CustomSwiper = ({ type }) => {
  return <>{type === "user-detail" && <UserDetailSwiper />}</>;
};

export default CustomSwiper;
