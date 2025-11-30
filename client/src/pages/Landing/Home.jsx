import { Link } from "react-router-dom";
import AutoplayBanner from "../../components/AutoplayBanner";
import BrandSlider from "../../components/BrandSlider";
import CategoryDisplay from "../../components/CategoryDisplay";
import Footer from "../../components/Footer";
import MainBanner from "../../components/MainBanner";
import FirstSection from "../../components/ProductDisplay/FirstSection";
import ProductByCategory from "../../components/ProductDisplay/ProductByCategory";
import StackButton from "../../components/StackButton";

const categories = [
  { _id: 1, name: "Giày nam", slug: "shoe-nam" },
  { _id: 2, name: "Giày nữ", slug: "shoe-nu" },
  { _id: 3, name: "Giày trẻ em", slug: "shoe-tre-em" },
];

const Home = () => {
  return (
    <>
      <MainBanner />
      {/*  */}
      <section className="!mt-10 container">
        <FirstSection />
      </section>
      <section className="!mt-10 container">
        <CategoryDisplay />
      </section>
      <section className="mt-10">
        <AutoplayBanner />
      </section>
      {categories &&
        categories.map((cate) => (
          <section className="!mt-10 container" key={cate._id}>
            <ProductByCategory category={cate} />
          </section>
        ))}
      {/* <section className="!mt-10 container">
        <BrandSlider />
      </section> */}
      <section className="mt-10">
        <div className="p-13 bg-black md:flex justify-center items-center gap-4">
          <p className="uppercase text-white  md:mb-0 mb-5 font-semibold text-3xl lg:text-4xl title">
            Đăng ký để nhận được các ưu đãi sớm nhất
          </p>
          <Link to="/login">
            <StackButton label={"Đăng ký ngay"} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
