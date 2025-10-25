import CategoryItem from "../CategoryItem.jsx";

const categories = [
  {
    _id: 1,
    name: "T-shirts",
    image:
      "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
  },
  {
    _id: 2,
    name: "T-shirts",
    image:
      "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
  },
  {
    _id: 3,

    name: "T-shirts",
    image:
      "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
  },
  {
    _id: 4,
    name: "T-shirts",
    image:
      "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/5cea04997b1a44d2a0321d3a7d3c1e0e_9366/ao-thun-liverpool-fc-terrace-icons.jpg",
  },
];

const CategoryDisplay = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-5">
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
