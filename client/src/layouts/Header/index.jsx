import React, { useState, useEffect } from "react";

// Mock API function
const fetchMenuData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    categories: [
      {
        id: "men",
        title: "Men",
        subcategories: [
          {
            name: "Shoes",
            link: "/men/shoes",
            items: [
              "Running",
              "Football",
              "Basketball",
              "Lifestyle",
              "Outdoor",
            ],
          },
          {
            name: "Clothing",
            link: "/men/clothing",
            items: ["T-Shirts", "Hoodies", "Jackets", "Pants", "Shorts"],
          },
          {
            name: "Sports",
            link: "/men/sports",
            items: ["Football", "Running", "Training", "Basketball", "Tennis"],
          },
        ],
      },
      {
        id: "women",
        title: "Women",
        subcategories: [
          {
            name: "Shoes",
            link: "/women/shoes",
            items: ["Running", "Lifestyle", "Training", "Outdoor", "Yoga"],
          },
          {
            name: "Clothing",
            link: "/women/clothing",
            items: ["Sports Bras", "Leggings", "Tops", "Jackets", "Dresses"],
          },
          {
            name: "Sports",
            link: "/women/sports",
            items: ["Yoga", "Running", "Training", "Dance", "Pilates"],
          },
        ],
      },
      {
        id: "kids",
        title: "Kids",
        subcategories: [
          {
            name: "Boys",
            link: "/kids/boys",
            items: ["Shoes", "T-Shirts", "Hoodies", "Sports", "School"],
          },
          {
            name: "Girls",
            link: "/kids/girls",
            items: ["Shoes", "Dresses", "Activewear", "Dance", "School"],
          },
          {
            name: "Infants",
            link: "/kids/infants",
            items: ["First Steps", "Bodysuits", "Sets", "Accessories"],
          },
        ],
      },
    ],
  };
};

const AdidasHeader = () => {
  const [menuData, setMenuData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [flyoutPosition, setFlyoutPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchMenuData().then(setMenuData);
  }, []);

  const handleMouseEnter = (event, category) => {
    const rect = event.target.getBoundingClientRect();
    setFlyoutPosition({
      x: rect.left,
      y: rect.bottom,
    });
    setActiveCategory(category);
    setFlyoutOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setFlyoutOpen(false);
      setActiveCategory(null);
    }, 150);
  };

  const FlyoutMenu = () => {
    if (!activeCategory || !flyoutOpen) return null;

    return (
      <div
        className="fixed bg-white shadow-2xl border-t-2 border-black z-50 p-8"
        style={{
          left: flyoutPosition.x - 100,
          top: flyoutPosition.y,
          minWidth: "700px",
          maxWidth: "900px",
        }}
        onMouseEnter={() => setFlyoutOpen(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-3 gap-8">
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

  const MobileMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={() => setMobileMenuOpen(false)} className="p-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {menuData?.categories.map((category) => (
          <div key={category.id} className="py-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
            {category.subcategories.map((sub, index) => (
              <a
                key={index}
                href={sub.link}
                className="block py-2 text-gray-600 hover:text-black"
              >
                {sub.name}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-black tracking-tight">
              adidas
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuData ? (
              menuData.categories.map((category) => (
                <button
                  key={category.id}
                  className="text-black font-medium text-sm uppercase tracking-wide hover:underline py-2 px-1 transition-all"
                  onMouseEnter={(e) => handleMouseEnter(e, category)}
                  onMouseLeave={handleMouseLeave}
                >
                  {category.title}
                </button>
              ))
            ) : (
              <div className="flex space-x-8">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded relative">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Flyout Menu */}
      <FlyoutMenu />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Demo Content */}
      <main className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Adidas Header Demo</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Hover over menu items on desktop to see the flyout menu
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md inline-block">
            <p className="text-sm text-gray-500">
              API Status:{" "}
              {menuData ? (
                <span className="text-green-600 font-semibold">
                  ✓ Menu data loaded successfully
                </span>
              ) : (
                <span className="text-orange-600 font-semibold">
                  ⏳ Loading menu data...
                </span>
              )}
            </p>
            {menuData && (
              <p className="text-xs text-gray-400 mt-2">
                {menuData.categories.length} categories loaded with flyout
                subcategories
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdidasHeader;
