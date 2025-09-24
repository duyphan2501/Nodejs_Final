import React from "react";

const Flyout = ({
  activeCategory,
  flyoutOpen,
  flyoutPosition,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!activeCategory || !flyoutOpen) return null;

  return (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-black z-50 p-8 "
      style={{
        left: 0,
        top: flyoutPosition.y + 15,
        width: "100vw",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
        {activeCategory.subcategories.map((sub, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-bold text-lg text-black border-b border-gray-200 pb-2">
              {sub.name}
            </h3>
            <ul className="space-y-2">
              {sub.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-black hover:underline text-sm block py-1 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={sub.link}
              className="inline-block mt-4 text-black font-semibold hover:underline text-sm"
            >
              View All {sub.name} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flyout;
