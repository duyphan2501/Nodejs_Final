import React from "react";

const FlyoutShoes = ({
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3 space-y-8">
            {activeCategory.sections?.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items?.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.link || "#"}
                        className="text-sm text-gray-700 hover:text-black transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="col-span-9">
            <div className="grid grid-cols-5 gap-6">
              {activeCategory.featured?.map((product, index) => (
                <div key={index} className="text-center group">
                  <a href={product.link || "#"} className="block">
                    <div className="bg-gray-100 aspect-square mb-3 rounded-lg overflow-hidden group-hover:bg-gray-200 transition-colors">
                      <img
                        src={product.image || "/api/placeholder/200/200"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-xs text-black tracking-wider">
                      {product.name}
                    </h4>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyoutShoes;
