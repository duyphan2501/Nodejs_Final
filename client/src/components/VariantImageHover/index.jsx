const VariantImageHover = ({ variants, selected, setSelected }) => {
  if (!variants || variants.length === 0) return null;
  return (
    <div className="flex size-14">
      {variants &&
        variants.map((variant, index) => (
          <img
            src={`${import.meta.env.VITE_API_URL}/${variant.images[0]}`}
            alt=""
            key={index}
            className={`hover:border-b-3 cursor-pointer transition ${
              selected._id === variant._id && "border-b-3"
            }`}
            onClick={() => setSelected(variant)}
          />
        ))}
    </div>
  );
};

export default VariantImageHover;
