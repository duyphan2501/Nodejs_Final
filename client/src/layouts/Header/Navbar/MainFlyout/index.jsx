import React from "react";

const MainFlyout = ({
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
          {/* Left column */}
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

            <div className="mt-12">
              <div
                className="bg-[#f5e6d3] text-black px-3 py-2 inline-block rounded-none
"
              >
                <span className="font-bold text-sm">Shopping DAYS</span>
              </div>
            </div>
          </div>

          <div className="absolute left-[27%] top-0 bottom-[13.2%] w-px bg-gray-200"></div>

          <div className="col-span-7 grid grid-cols-4 gap-8">
            {activeCategory.categories?.map((category, index) => (
              <div key={index}>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wide">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items?.map((item, idx) => (
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

          {/* Right column  */}
          <div className="col-span-2">
            <a
              href={activeCategory.promotion?.link || "#"}
              className="block group"
            >
              <div className="bg-gray-100 aspect-[3/4] rounded-lg overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <img
                  src={
                    activeCategory.promotion?.image ||
                    "/api/placeholder/300/400"
                  }
                  alt={activeCategory.promotion?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-lg text-black">
                {activeCategory.promotion?.title}
              </h4>
            </a>
          </div>
        </div>

        <div className="absolute top-[86.5%] left-0 right-0 h-px bg-gray-200"></div>

        <div className="w-full border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="flex space-x-8">
              {activeCategory.bottomCategories?.map((item, index) => (
                <a
                  key={index}
                  href={item.link || "#"}
                  className="text-sm font-medium text-black hover:underline"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFlyout;
