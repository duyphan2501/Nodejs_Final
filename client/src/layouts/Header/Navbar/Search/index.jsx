import React, { useState, useRef, useEffect } from "react";

// Fake API data
const fakeProducts = [
  {
    id: 1,
    name: "Giày Samba OG",
    category: "Originals",
    price: "2.700.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Giay_Samba_OG_trang_B75806_01_standard.jpg",
  },
  {
    id: 2,
    name: "Giày Adizero EVO SL",
    category: "Nam Performance",
    price: "4.000.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/d7c1e3af8ab34e5ca2fca8bf01179d62_9366/Giay_Adizero_EVO_SL_DJen_IF9342_01_standard.jpg",
  },
  {
    id: 3,
    name: "Dép Lightblaze",
    category: "Sportswear",
    price: "1.500.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/fd92b5c6c8964a2e8c7ca8bf01177e5e_9366/Dep_Lightblaze_DJen_IF3940_01_standard.jpg",
  },
  {
    id: 4,
    name: "Giày Superstar",
    category: "Originals",
    price: "2.500.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/12365dbc5f2945fe93e4a8bf01177e0e_9366/Giay_Superstar_trang_EG4958_01_standard.jpg",
  },
  {
    id: 5,
    name: "Giày Stan Smith",
    category: "Originals",
    price: "2.600.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/771d70adf3f743778c5aa8bf01177d9e_9366/Giay_Stan_Smith_trang_FX5500_01_standard.jpg",
  },
  {
    id: 6,
    name: "Giày Ultraboost Light",
    category: "Nam Running",
    price: "5.500.000đ",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/5a3f8c21b03d4b228b8aa8bf01177c0e_9366/Giay_Ultraboost_Light_DJen_GY9350_01_standard.jpg",
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = fakeProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsOpen(true);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
    setIsOpen(false);
  };

  const handleProductClick = (productId) => {
    // Navigation logic - replace with your router
    window.location.href = `/product/${productId}`;
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleViewAll = () => {
    // Navigation to all products with search query
    window.location.href = `/products?search=${searchQuery}`;
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            const input = document.getElementById("search-input");
            if (input) input.focus();
          }, 0);
        }}
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-screen max-w-md bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3">Sản phẩm</h3>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            {product.category}
                          </p>
                          <p className="font-medium text-sm mb-1 truncate">
                            {product.name}
                          </p>
                          <p className="font-bold text-sm">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View All Link */}
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-left font-semibold text-sm hover:underline"
                  >
                    Xem tất cả "{searchQuery}"
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Không tìm thấy sản phẩm
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
