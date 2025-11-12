import React, { useState, useRef, useEffect, useContext } from "react";
import Flyout from "./FlyoutShoes";
import MainFlyout from "./MainFlyout";
import CollectionsFlyout from "./CollectionsFlyout";
import CartIcon from "./CartIcon";
import { MyContext } from "../../../Context/MyContext";
import useUserStore from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

const Navbar = ({
  menuData,
  showHeader,
  logoText,
  customLogo,
  onMobileMenuToggle,
}) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [flyoutPosition, setFlyoutPosition] = useState({ x: 0, y: 0 });
  const { isOpenAccountMenu, setIsOpenAccountMenu } = useContext(MyContext);
  const flyoutTimeoutRef = useRef(null);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (flyoutTimeoutRef.current) {
        clearTimeout(flyoutTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (event, category) => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
      flyoutTimeoutRef.current = null;
    }

    const rect = event.target.getBoundingClientRect();
    const headerHeight = showHeader ? rect.bottom : 64;
    setFlyoutPosition({
      x: rect.left,
      y: headerHeight,
    });
    setActiveCategory(category);
    setFlyoutOpen(true);
  };

  const handleMouseLeave = () => {
    flyoutTimeoutRef.current = setTimeout(() => {
      setFlyoutOpen(false);
      setActiveCategory(null);
    }, 300);
  };

  const handleFlyoutMouseEnter = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
      flyoutTimeoutRef.current = null;
    }
  };

  const handleFlyoutMouseLeave = () => {
    setFlyoutOpen(false);
    setActiveCategory(null);
  };

  const handleAccountMenuToggle = () => {
    setIsOpenAccountMenu(!isOpenAccountMenu);
    if (flyoutOpen) {
      setFlyoutOpen(false);
      setActiveCategory(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2" onClick={onMobileMenuToggle}>
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
          {customLogo ? (
            customLogo
          ) : (
            <a href="/">
              <h1 className="text-2xl lg:text-3xl font-bold text-black tracking-tight">
                {logoText}
              </h1>
            </a>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button
            className="text-black font-medium cursor-pointer text-sm uppercase tracking-wide hover:underline py-2 px-1 transition-all"
            onClick={() => navigate("/products", { replace: false })}
          >
            tất cả sản phẩm
          </button>
          {menuData ? (
            menuData.categories.map((category) => (
              <button
                key={category.id}
                className="text-black cursor-pointer font-medium text-sm uppercase tracking-wide hover:underline py-2 px-1 transition-all"
                onMouseEnter={(e) => handleMouseEnter(e, category)}
                onMouseLeave={handleMouseLeave}
              >
                {category.title}
              </button>
            ))
          ) : (
            <div className="flex space-x-8">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          )}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 md:space-x-3 ">
          {/* Search */}
          <Search />

          {/* Account Menu Button */}
          {!user ? (
            <>
              <a
                className="font-semibold cursor-pointer hover:bg-gray-100 p-2 rounded active:bg-gray-200 transition"
                href="/login"
              >
                Đăng nhập
              </a>
            </>
          ) : (
            <button
              className={`p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer ${
                isOpenAccountMenu ? "bg-gray-100" : ""
              }`}
              onClick={handleAccountMenuToggle}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          )}

          {/* Shopping Cart */}
          <CartIcon />
        </div>
      </div>

      {/* Category Flyouts */}
      {activeCategory?.type === "remaining" && (
        <div className="absolute top-full left-0 right-0 z-30">
          <MainFlyout
            activeCategory={activeCategory}
            flyoutOpen={flyoutOpen}
            flyoutPosition={flyoutPosition}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          />
        </div>
      )}

      {activeCategory?.type === "shoe" && (
        <div className="absolute top-full left-0 right-0 z-30">
          <Flyout
            activeCategory={activeCategory}
            flyoutOpen={flyoutOpen}
            flyoutPosition={flyoutPosition}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          />
        </div>
      )}

      {activeCategory?.type === "sandal" && (
        <div className="absolute top-full left-0 right-0 z-30">
          <Flyout
            activeCategory={activeCategory}
            flyoutOpen={flyoutOpen}
            flyoutPosition={flyoutPosition}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          />
        </div>
      )}

      {activeCategory?.type === "backpack" && (
        <div className="absolute top-full left-0 right-0 z-30">
          <Flyout
            activeCategory={activeCategory}
            flyoutOpen={flyoutOpen}
            flyoutPosition={flyoutPosition}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          />
        </div>
      )}

      {activeCategory?.type === "collections" && (
        <div className="absolute top-full left-0 right-0 z-30">
          <CollectionsFlyout
            activeCategory={activeCategory}
            flyoutOpen={flyoutOpen}
            flyoutPosition={flyoutPosition}
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
