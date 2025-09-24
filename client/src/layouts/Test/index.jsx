import React, { useState } from "react";

// In production, you would import this from your separate categories.js file
const categories = {
  // Flyout Menu 1 - Shoes Focus
  shoes: {
    title: "GIÀY",
    sections: [
      {
        title: "GIÀY HÀNG MỚI VỀ",
        items: [
          { name: "SL 72", link: "/shoes/sl72" },
          { name: "Stan Smith", link: "/shoes/stan-smith" },
          { name: "Low Profile Collection", link: "/shoes/low-profile" },
        ],
      },
      {
        title: "TRENDING SHOES",
        items: [
          { name: "Every Day Running", link: "/shoes/running" },
          { name: "Tiếp sức đường chạy", link: "/shoes/running-support" },
          { name: "Race to win", link: "/shoes/race" },
          { name: "Giày đi bộ", link: "/shoes/walking" },
        ],
      },
    ],
    featured: [
      { name: "SAMBA", image: "/images/samba.jpg", link: "/shoes/samba" },
      { name: "GAZELLE", image: "/images/gazelle.jpg", link: "/shoes/gazelle" },
      { name: "CAMPUS", image: "/images/campus.jpg", link: "/shoes/campus" },
      { name: "SPEZIAL", image: "/images/spezial.jpg", link: "/shoes/spezial" },
      {
        name: "SUPERSTAR",
        image: "/images/superstar.jpg",
        link: "/shoes/superstar",
      },
    ],
  },

  // Flyout Menu 2 - Full Categories
  main: {
    title: "DANH MỤC CHÍNH",
    sections: [
      {
        title: "NỔI BẬT",
        items: [
          { name: "Hàng Mới Về", link: "/new-arrivals" },
          { name: "Độc quyền hội viên", link: "/member-exclusive" },
        ],
      },
      {
        title: "ĐƯỢC YÊU THÍCH TRONG THÁNG",
        items: [
          { name: "LIVERPOOL FC 25/26 KITS", link: "/liverpool-kits" },
          { name: "Slide into Summer", link: "/summer-collection" },
          { name: "Superstar", link: "/superstar" },
          { name: "Low Profile Collection", link: "/low-profile" },
          { name: "T-toe Collection", link: "/t-toe" },
          { name: "Padel Tennis", link: "/padel-tennis" },
        ],
      },
    ],
    categories: [
      {
        title: "GIÀY",
        items: [
          { name: "Hàng mới về", link: "/shoes/new" },
          { name: "Originals", link: "/shoes/originals" },
          { name: "Bóng đá", link: "/shoes/football" },
          { name: "Chạy bộ", link: "/shoes/running" },
          { name: "Tập", link: "/shoes/training" },
          { name: "Ngoài trời", link: "/shoes/outdoor" },
          { name: "Bóng rổ", link: "/shoes/basketball" },
          { name: "Dép & Dép xỏ ngón", link: "/shoes/slides" },
          { name: "Quần vợt", link: "/shoes/tennis" },
          { name: "Sportswear", link: "/shoes/sportswear" },
          { name: "Giày sneaker đen", link: "/shoes/black-sneakers" },
          { name: "Đánh gôn", link: "/shoes/golf" },
          { name: 'GIÀY "MUST-HAVE"', link: "/shoes/must-have" },
          { name: "Walking Shoes", link: "/shoes/walking" },
        ],
      },
      {
        title: "QUẦN ÁO",
        items: [
          { name: "Áo thun & Áo polo", link: "/clothing/tshirts" },
          { name: "Áo Jersey", link: "/clothing/jerseys" },
          { name: "Áo hoodie", link: "/clothing/hoodies" },
          { name: "Bộ đồ thể thao", link: "/clothing/tracksuits" },
          { name: "Quần", link: "/clothing/pants" },
          { name: "Quần bơ", link: "/clothing/swimwear" },
          { name: "Quần short", link: "/clothing/shorts" },
          { name: "Sportswear", link: "/clothing/sportswear" },
          { name: "Áo khoác", link: "/clothing/jackets" },
          { name: "CỠ BẢN", link: "/clothing/basics" },
          { name: "Tracksuits", link: "/clothing/tracksuits-full" },
        ],
      },
      {
        title: "PHỤ KIỆN",
        items: [
          { name: "Tất Cả Túi", link: "/accessories/bags" },
          { name: "Tất", link: "/accessories/socks" },
          { name: "Mũ Lưỡi Trai & Đội Đầu", link: "/accessories/hats" },
          { name: "Găng Tay", link: "/accessories/gloves" },
          {
            name: "Ốp bao vệ ống chân & Băng buộc",
            link: "/accessories/protection",
          },
          { name: "Ball", link: "/accessories/balls" },
        ],
      },
      {
        title: "THỂ THAO",
        items: [
          { name: "Bóng đá", link: "/sports/football" },
          { name: "Chạy", link: "/sports/running" },
          { name: "Tập luyện", link: "/sports/training" },
          { name: "Basketball", link: "/sports/basketball" },
          { name: "Bơi lội", link: "/sports/swimming" },
          { name: "Đánh gôn", link: "/sports/golf" },
          { name: "Quần vợt", link: "/sports/tennis" },
        ],
      },
    ],
    promotion: {
      title: "EVO SL. FEEL FAST.",
      image: "/images/evo-sl-promotion.jpg",
      link: "/evo-sl-collection",
    },
    bottomCategories: [
      { name: "Tất cả sản phẩm dành cho nam", link: "/men/all" },
      { name: "Tất cả giày nam", link: "/men/shoes/all" },
      { name: "Tất cả phụ kiện dành cho nam", link: "/men/accessories/all" },
      { name: "All Men's Sports", link: "/men/sports/all" },
    ],
  },

  // Flyout Menu 3 - Brand Collections
  collections: {
    title: "BỘ SƯU TẬP",
    brands: [
      {
        title: "ORIGINALS",
        image: "/images/originals-brand.jpg",
        items: [
          { name: "Hàng Mới Về", link: "/originals/new" },
          { name: "Giày", link: "/originals/shoes" },
          { name: "Quần áo", link: "/originals/clothing" },
          { name: "Phụ kiện", link: "/originals/accessories" },
          { name: "Superstar", link: "/originals/superstar" },
          { name: "Samba", link: "/originals/samba" },
          { name: "Gazelle", link: "/originals/gazelle" },
          { name: "Spezial", link: "/originals/spezial" },
          { name: "SL 72", link: "/originals/sl72" },
          { name: "Bộ sưu tập Premium", link: "/originals/premium" },
          { name: "Bộ sưu tập T-Toe", link: "/originals/t-toe" },
        ],
      },
      {
        title: "ADIDAS ATHLETICS",
        image: "/images/athletics-brand.jpg",
        items: [
          { name: "Giày", link: "/athletics/shoes" },
          { name: "Quần áo", link: "/athletics/clothing" },
          { name: "Hàng Mới Về", link: "/athletics/new" },
          { name: "Ultraboost DNA", link: "/athletics/ultraboost" },
          { name: "Adilette", link: "/athletics/adilette" },
          { name: "Essentials", link: "/athletics/essentials" },
          { name: "Z.N.E", link: "/athletics/zne" },
        ],
      },
      {
        title: "TERREX",
        image: "/images/terrex-brand.jpg",
        items: [
          { name: "About Terrex", link: "/terrex/about" },
          { name: "Giày", link: "/terrex/shoes" },
          { name: "Quần áo", link: "/terrex/clothing" },
          { name: "Phụ kiện", link: "/terrex/accessories" },
        ],
      },
      {
        title: "Y-3",
        image: "/images/y3-brand.jpg",
        items: [
          { name: "giay", link: "/y3/shoes" },
          { name: "quan_ao", link: "/y3/clothing" },
          { name: "phu_kien", link: "/y3/accessories" },
        ],
      },
    ],
  },
};

const FlyoutMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  // Shoes Flyout Component
  const ShoesFlyout = ({ data }) => (
    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left sections */}
          <div className="col-span-3 space-y-8">
            {data.sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
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

          {/* Featured products grid */}
          <div className="col-span-9">
            <div className="grid grid-cols-5 gap-6">
              {data.featured.map((product, index) => (
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

  // Main Categories Flyout Component
  const MainFlyout = ({ data }) => (
    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left column - Featured sections */}
          <div className="col-span-2 space-y-8">
            {data.sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
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

            {/* Adiclub section */}
            <div className="mt-12">
              <div className="bg-black text-white p-4 rounded-lg text-center">
                <div className="font-bold text-lg mb-2">adiclub</div>
                <div className="text-sm">DAYS</div>
              </div>
            </div>
          </div>

          {/* Middle columns - Categories */}
          <div className="col-span-7 grid grid-cols-4 gap-8">
            {data.categories.map((category, index) => (
              <div key={index}>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wide">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
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

          {/* Right column - Promotion */}
          <div className="col-span-3">
            <a href={data.promotion.link || "#"} className="block group">
              <div className="bg-gray-100 aspect-[3/4] rounded-lg overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <img
                  src={data.promotion.image || "/api/placeholder/300/400"}
                  alt={data.promotion.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-lg text-black">
                {data.promotion.title}
              </h4>
            </a>
          </div>
        </div>

        {/* Bottom categories */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex space-x-8">
            {data.bottomCategories.map((item, index) => (
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
  );

  // Collections Flyout Component
  const CollectionsFlyout = ({ data }) => (
    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {data.brands.map((brand, index) => (
            <div key={index} className="group">
              <div className="mb-6">
                <div className="bg-gray-100 aspect-[4/3] rounded-lg overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                  <img
                    src={brand.image || "/api/placeholder/400/300"}
                    alt={brand.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-sm text-black mb-4 tracking-wider">
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
  );

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {/* Menu Items */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("shoes")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
                GIÀY
              </button>
              {activeMenu === "shoes" && (
                <ShoesFlyout data={categories.shoes} />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("main")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
                NAM
              </button>
              {activeMenu === "main" && <MainFlyout data={categories.main} />}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveMenu("collections")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
                BỘ SƯU TẬP
              </button>
              {activeMenu === "collections" && (
                <CollectionsFlyout data={categories.collections} />
              )}
            </div>

            {/* Additional menu items */}
            <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
              NỮ
            </button>
            <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
              TRẺ EM
            </button>
            <button className="py-4 text-sm font-medium text-black hover:text-gray-600 transition-colors">
              THỂ THAO
            </button>
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Hover over menu items to see flyouts
          </h1>
          <div className="text-center text-gray-600">
            <p>This demo shows the three different flyout menu styles:</p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>GIÀY</strong> - Product-focused with image grid
              </li>
              <li>
                <strong>NAM</strong> - Full category navigation with promotion
              </li>
              <li>
                <strong>BỘ SƯU TẬP</strong> - Brand collections with images
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyoutMenu;
