import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="h-[450px] sm:h-[400px] lg:h-[300px] bg-background">
      <div className="w-3/5 h-3/4 mx-auto">
        <img
          src={`${import.meta.env.VITE_API_URL}/${category.image}`}
          alt=""
          className="object-cover size-full"
        />
      </div>
      <div className="text-center mt-4">
        <Link
          to={""}
          className="text-center uppercase font-bold hover:underline"
        >
          {category.name}
        </Link>
      </div>
    </div>
  );
};

export default CategoryItem;
