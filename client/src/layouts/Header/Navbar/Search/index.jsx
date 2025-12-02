import React, { useState, useRef, useEffect } from "react";
import useProductStore from "../../../../store/useProductStore";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);
  const searchProducts = useProductStore((s) => s.searchProducts);

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
    const timer = setTimeout(async () => {
      if (searchQuery !== "") {
        const res = await searchProducts(searchQuery);

        const filtered = res.map((p) => ({
          id: p._id,
          name: p.name,
          category: p.categories?.name || "Không xác định",
          price: p.variants?.[0]?.price
            ? (
                Number(p.variants[0].price) *
                (1 - Number(p.variants[0].discount || 0) / 100)
              ).toLocaleString("vi-VN") + "đ"
            : "Liên hệ",

          image: `${import.meta.env.VITE_API_URL}/${
            p.variants[0]?.images?.[0] || ""
          }`,
          slug: p.slug,
        }));
        setFilteredProducts(filtered);
        setIsOpen(true);
      } else {
        setFilteredProducts([]);
        // setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
    setIsOpen(false);
  };

  const handleProductClick = (slug) => {
    // Navigation logic - replace with your router
    window.location.href = `/product/${slug}`;
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleViewAll = () => {
    // Navigation to all products with search query
    window.location.href = `/products/search?term=${searchQuery}`;
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
                    {filteredProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
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
