import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const ProductRecommendations = ({ onProductClick }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    // Fetch recommendations from API
    // Replace this with actual API call
    const fetchRecommendations = async () => {
      // Example: const response = await fetch('/api/recommendations');
      // const data = await response.json();
      // setRecommendations(data);

      // Demo data
      const demoData = [
        {
          id: 2,
          name: "Giày Golf Đỉnh Liền S2G 24 Trẻ Em",
          category: "Performance",
          price: 1540000,
          originalPrice: 2200000,
          discount: "-30%",
          link: "/product/2",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        },
        {
          id: 3,
          name: "Bộ Quần Áo Thun Seasonal Essentials Fun Trẻ Em",
          category: "Sportswear",
          price: 765000,
          originalPrice: 850000,
          discount: "-10%",
          link: "/product/3",
          image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop",
        },
        {
          id: 4,
          name: "Giày Superstar II Comfort Closure Trẻ Em",
          category: "Originals",
          price: 1700000,
          link: "/product/4",
          image:
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop",
        },
        {
          id: 5,
          name: "Áo Đấu Sân Khách Arsenal 24/25 Trẻ Em",
          category: "Performance",
          price: 1050000,
          originalPrice: 1500000,
          discount: "-30%",
          link: "/product/5",
          image:
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop",
        },
        {
          id: 6,
          name: "Mũ Stripes And Pines",
          category: "Performance",
          price: 455000,
          originalPrice: 650000,
          discount: "-30%",
          link: "/product/6",
          image:
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
        },
      ];

      setRecommendations(demoData);
    };

    fetchRecommendations();
  }, []);

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1));
  };

  const handleNext = () => {
    setStartIndex(
      Math.min(recommendations.length - itemsPerPage, startIndex + 1)
    );
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else if (product.link) {
      window.location.href = product.link;
    }
  };

  const visibleProducts = recommendations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 mb-6">
      <h2 className="text-4xl font-bold mb-6">GỢI Ý CHO BẠN</h2>

      <div className="relative">
        {/* Previous Button */}
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all z-10 hidden md:flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[280px] object-cover bg-gray-200"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-bold mb-1 text-black">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="mb-2">
                    <span className="text-xs line-through text-gray-500 mr-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs text-red-600 font-semibold">
                      Giá gốc {product.discount}
                    </span>
                  </div>
                )}
                <div className="text-xs mb-1 text-black font-medium">
                  {product.name}
                </div>
                <div className="text-xs text-gray-500">{product.category}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        {startIndex < recommendations.length - itemsPerPage && (
          <button
            onClick={handleNext}
            className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all z-10 hidden md:flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        )}
        <div className="flex mt-3 items-center gap-2 text-xl underline cursor-pointer">
          <RotateCcw size={16} />
          <span>TRẢ HÀNG DỄ DÀNG</span>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
