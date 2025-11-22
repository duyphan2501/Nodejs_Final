import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import useCategoryStore from "../../store/useCategoryStore";
import useProductStore from "../../store/useProductStore";

const Header = ({ logoText = "Thrift Shop", customLogo = null }) => {
  const [menuData, setMenuData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mobile menu states
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileActiveSubcategory, setMobileActiveSubcategory] = useState(null);
  const [mobileBreadcrumb, setMobileBreadcrumb] = useState([]);

  //Store fetch menu data
  const getCategoriesForHeader = useCategoryStore(
    (s) => s.getCategoriesForHeader
  );
  const getProductFeature = useProductStore((s) => s.getProductFeature);

  //Fetch function
  const fetchMenuData = async () => {
    const [resCate, resProduct] = await Promise.all([
      getCategoriesForHeader(),
      getProductFeature(6, 6, { forHeader: true }),
    ]);

    const menu = resCate.map((c) => ({
      ...c,
      sections: [
        {
          title:
            c.type === "shoe"
              ? "GIÀY HÀNG MỚI VỀ"
              : c.type === "sandal"
              ? "DÉP HÀNG MỚI VỀ"
              : c.type === "backpack"
              ? "BA LÔ HÀNG MỚI VỀ"
              : "",
          items:
            c.type === "shoe"
              ? resProduct.topNewShoe
              : c.type === "sandal"
              ? resProduct.topNewSandal
              : c.type === "backpack"
              ? resProduct.topNewBackpack
              : [],
        },
        {
          title:
            c.type === "shoe"
              ? "XU HƯỚNG GIÀY"
              : c.type === "sandal"
              ? "XU HƯỚNG DÉP"
              : c.type === "backpack"
              ? "XU HƯỚNG BA LÔ"
              : "",
          items:
            c.type === "shoe"
              ? resProduct.topSellShoe
              : c.type === "sandal"
              ? resProduct.topSellSandal
              : c.type === "backpack"
              ? resProduct.topSellBackpack
              : [],
        },
      ],
    }));

    return { categories: menu };
  };

  useEffect(() => {
    fetchMenuData().then(setMenuData);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(true);
    setShowHeader(true);
    document.body.style.overflow = "hidden";
  };

  const handleMobileCategoryClick = (category) => {
    setMobileActiveCategory(category);
    setMobileBreadcrumb([category.title]);
  };

  const handleMobileSubcategoryClick = (section) => {
    setMobileActiveSubcategory(section);
    setMobileBreadcrumb([mobileActiveCategory.title, section.title]);
  };

  const handleMobileBack = () => {
    if (mobileActiveSubcategory) {
      setMobileActiveSubcategory(null);
      setMobileBreadcrumb([mobileActiveCategory.title]);
    } else if (mobileActiveCategory) {
      setMobileActiveCategory(null);
      setMobileBreadcrumb([]);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileActiveCategory(null);
    setMobileActiveSubcategory(null);
    setMobileBreadcrumb([]);
    document.body.style.overflow = "";
  };

  const MobileMenuContent = () => {
    if (mobileActiveSubcategory) {
      return (
        <div
          className={`p-0 bg-white transform transition-transform duration-300 ${
            mobileActiveSubcategory ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-4 max-h-[90vh] overflow-y-auto bg-white">
            {mobileActiveSubcategory.items.map((item, index) => (
              <a
                key={index}
                href={item.link || "#"}
                className="block py-2 text-gray-800 hover:text-black border-b border-gray-100 last:border-b-0 transform transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-center space-x-3">
                  {item.product_images?.[0] && (
                    <img
                      src={item.product_images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.discount_price ? (
                      <div className="text-sm">
                        <span className="text-red-600 font-semibold">
                          {item.discount_price.toLocaleString()}₫
                        </span>
                        <span className="text-gray-400 line-through ml-2">
                          {item.original_price.toLocaleString()}₫
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {item.original_price.toLocaleString()}₫
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (mobileActiveCategory) {
      return (
        <div
          className={`p-0 bg-white transform transition-transform duration-300 ${
            mobileActiveCategory ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-0 bg-white">
            {mobileActiveCategory?.sections?.map((section, index) => (
              <button
                key={index}
                onClick={() => handleMobileSubcategoryClick(section)}
                className="w-full flex items-center justify-between py-4 text-left text-gray-800 hover:text-black border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-50 hover:translate-x-1"
              >
                <span className="font-medium">{section.title}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`p-4 space-y-0 bg-white transform transition-transform duration-300 ${
          !mobileActiveCategory ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a
          href={"/products"}
          className="text-black font-medium cursor-pointer text-sm uppercase tracking-wide hover:underline py-2 px-1 transition-all"
        >
          tất cả sản phẩm
        </a>
        {menuData?.categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => handleMobileCategoryClick(category)}
            className={`w-full flex items-center justify-between py-4 text-left font-medium text-gray-800 hover:text-black border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-50 hover:translate-x-1`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <span>{category.title}</span>
            <svg
              className="w-5 h-5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const MobileMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="flex items-center">
          {(mobileActiveCategory || mobileActiveSubcategory) && (
            <button
              onClick={handleMobileBack}
              className="p-2 mr-2 -ml-2 hover:bg-gray-100 rounded transition-colors duration-200"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-bold transition-all duration-300">
            {mobileActiveSubcategory
              ? mobileActiveSubcategory.title
              : mobileActiveCategory
              ? mobileActiveCategory.title
              : "Menu"}
          </h2>
        </div>
        <button
          onClick={closeMobileMenu}
          className="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <MobileMenuContent />
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className={`bg-white border-b border-gray-200`}>
        <Navbar
          menuData={menuData}
          showHeader={showHeader}
          logoText={logoText}
          customLogo={customLogo}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
      </header>

      <MobileMenu />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Header;
