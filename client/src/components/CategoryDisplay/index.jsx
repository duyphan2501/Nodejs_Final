import { useEffect, useMemo, useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import CategoryItem from "../CategoryItem.jsx";

// const categories = [
//   {
//     _id: 1,
//     name: "T-shirts",
//     image:
//       "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
//   },
//   {
//     _id: 2,
//     name: "T-shirts",
//     image:
//       "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
//   },
//   {
//     _id: 3,

//     name: "T-shirts",
//     image:
//       "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
//   },
//   {
//     _id: 4,
//     name: "T-shirts",
//     image:
//       "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
//   },
// ];

const CategoryDisplay = () => {
  const getListCategories = useCategoryStore((s) => s.getListCategories);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(false);
      const rawData = await getListCategories();
      const result = rawData.map((c) => ({
        _id: c.children[0]._id,
        name: c.children[0].name,
        image: c.children[0].image,
      }));
      setCategories(result);
      setLoading(true);
    };

    fetchCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {categories &&
        categories.map((category) => (
          <div className="grid" key={category._id}>
            <CategoryItem category={category} />
          </div>
        ))}
    </div>
  );
};

export default CategoryDisplay;
