import React from "react";

const CollectionsFlyout = ({
  activeCategory,
  flyoutOpen,
  flyoutPosition,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!activeCategory || !flyoutOpen) return null;

  return (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-black z-50"
      style={{
        left: 0,
        top: flyoutPosition.y + 15,
        width: "100vw",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            {activeCategory.brands.map((brand, index) => (
              <div key={index} className="group">
                <div className="mb-6">
                  
                    <img
                      src={brand.image || "/api/placeholder/400/300"}
                      alt={brand.title}
                      className="max-w-[200px] max-h-[170px] object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                 
                  <h3 className="font-bold mt-2 text-sm text-black mb-4 tracking-wider">
                    {brand.title}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {brand.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.link || "#"}
                        className="text-sm text-gray-700 hover:text-black transition-colors block"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default CollectionsFlyout;
