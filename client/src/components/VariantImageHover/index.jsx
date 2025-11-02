const VariantImageHover = ({ variants, selected, setSelected }) => {
  return (
    <div className="flex size-14">
      {variants &&
        variants.map((variant, index) => (
          <img
            src={variant.images[0]}
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
