import React from "react";

// Layout 1: Brand-focused layout with large images
const BrandFlyout = ({ activeCategory, flyoutOpen, flyoutPosition, onMouseEnter, onMouseLeave }) => {
  if (!activeCategory || !flyoutOpen) return null;

  const brandData = [
    {
      title: "ORIGINALS",
      subtitle: "Hàng Mới Về",
      image: "/api/placeholder/300/200",
      items: ["Giày", "Quần áo", "Phụ kiện"],
      featured: ["Superstar", "Samba", "Gazelle", "Spezial", "SL 72"],
      collections: ["Bộ sưu tập Premium", "Bộ sưu tập T-Toe"]
    },
    {
      title: "ADIDAS ATHLETICS",
      subtitle: "Giày",
      image: "/api/placeholder/300/200", 
      items: ["Quần áo", "Hàng Mới Về", "Ultraboost DNA", "Adilette"],
      featured: ["Essentials", "Z.N.E"]
    },
    {
      title: "TERREX", 
      subtitle: "About Terrex",
      image: "/api/placeholder/300/200",
      items: ["Giày", "Quần áo", "Phụ kiện"]
    },
    {
      title: "Y-3",
      subtitle: "giày",
      image: "/api/placeholder/300/200",
      items: ["quan_ao", "phu_kien"]
    }
  ];

  return (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-black z-50 p-8"
      style={{
        left: 0,
        top: flyoutPosition.y + 15,
        width: "100vw",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">
        {brandData.map((brand, index) => (
          <div key={index} className="space-y-4">
            <div className="relative">
              <img 
                src={brand.image} 
                alt={brand.title}
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded">
                <h3 className="text-white font-bold text-xl">{brand.title}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{brand.subtitle}</p>
              {brand.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href="#"
                  className="block text-sm text-gray-800 hover:text-black hover:underline py-1"
                >
                  {item}
                </a>
              ))}
              {brand.featured && (
                <div className="mt-4 space-y-1">
                  {brand.featured.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href="#"
                      className="block text-sm text-gray-800 hover:text-black hover:underline py-1"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
              {brand.collections && (
                <div className="mt-4 space-y-1">
                  {brand.collections.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href="#"
                      className="block text-sm text-gray-800 hover:text-black hover:underline py-1"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Layout 2: Category-focused layout with promotional image
const CategoryFlyout = ({ activeCategory, flyoutOpen, flyoutPosition, onMouseEnter, onMouseLeave }) => {
  if (!activeCategory || !flyoutOpen) return null;

  const categoryData = [
    {
      title: "NỔI BẬT",
      items: ["Hàng Mới Về", "Độc quyền hội viên"]
    },
    {
      title: "GIÀY",
      items: [
        "Hàng mới về", "Originals", "Bóng đá", "Chạy bộ", "Tập", 
        "Ngoài trời", "Bóng rổ", "Dép & Dép xỏ ngón", "Quần vợt", 
        "Sportswear", "Giày sneaker đen", "Đánh gôn"
      ]
    },
    {
      title: "QUẦN ÁO", 
      items: [
        "Áo thun & Áo polo", "Áo Jersey", "Áo hoodie", "Bộ đồ thể thao", 
        "Quần", "Quần bó", "Quần short", "Sportswear", "Áo khoác"
      ]
    },
    {
      title: "PHỤ KIỆN",
      items: [
        "Tất Cả Túi", "Tất", "Mũ Lưỡi Trai & Đội Đầu", "Găng Tay", 
        "Ốp bao vệ ống chân & Băng bước", "Ball"
      ]
    },
    {
      title: "THỂ THAO",
      items: [
        "Bóng đá", "Chạy", "Tập luyện", "Basketball", "Bơi lội", 
        "Đánh gôn", "Quần vợt"
      ]
    }
  ];

  return (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-black z-50 p-8"
      style={{
        left: 0,
        top: flyoutPosition.y + 15,
        width: "100vw",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-6 gap-8 max-w-7xl mx-auto">
        {categoryData.map((category, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-bold text-lg text-black border-b border-gray-200 pb-2">
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.items.map((item, itemIndex) => (
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
          </div>
        ))}
        
        {/* Promotional Image */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-black">EVO SL. FEEL FAST.</h3>
          <div className="relative">
            <img 
              src="/api/placeholder/300/400" 
              alt="EVO SL Campaign"
              className="w-full h-80 object-cover rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 3: Product-focused layout with shoe images
const ProductFlyout = ({ activeCategory, flyoutOpen, flyoutPosition, onMouseEnter, onMouseLeave }) => {
  if (!activeCategory || !flyoutOpen) return null;

  const productData = [
    {
      title: "GIÀY HÀNG MỚI VỀ",
      items: ["SL 72", "Stan Smith", "Low Profile Collection"],
      featured: ["TRENDING SHOES", "Every Day Running", "Tiếp sức đường chạy", "Race to win", "Giày đi bộ"]
    },
    {
      title: "SAMBA",
      image: "/api/placeholder/200/150",
      color: "White/Black"
    },
    {
      title: "GAZELLE", 
      image: "/api/placeholder/200/150",
      color: "Navy/White"
    },
    {
      title: "CAMPUS",
      image: "/api/placeholder/200/150", 
      color: "Black/White"
    },
    {
      title: "SPEZIAL",
      image: "/api/placeholder/200/150",
      color: "Green/White"
    },
    {
      title: "SUPERSTAR",
      image: "/api/placeholder/200/150",
      color: "White/Black"
    }
  ];

  return (
    <div
      className="fixed bg-white shadow-2xl border-t-2 border-black z-50 p-8"
      style={{
        left: 0,
        top: flyoutPosition.y + 15,
        width: "100vw",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-6 gap-8 max-w-7xl mx-auto">
        {productData.map((product, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-bold text-lg text-black">
              {product.title}
            </h3>
            
            {product.image ? (
              <div className="space-y-2">
                <div className="bg-gray-100 p-4 rounded">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-32 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600">{product.color}</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {product.items?.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-black hover:underline text-sm block py-1 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                {product.featured && (
                  <div className="mt-4 space-y-1">
                    <p className="font-medium text-sm text-black">{product.featured[0]}</p>
                    {product.featured.slice(1).map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href="#"
                        className="block text-sm text-gray-600 hover:text-black hover:underline py-1"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Demo component to showcase all layouts
const FlyoutLayoutDemo = () => {
  const [activeLayout, setActiveLayout] = React.useState('brand');
  const [flyoutOpen, setFlyoutOpen] = React.useState(true);
  
  const flyoutPosition = { x: 0, y: 100 };
  const mockCategory = { id: 'demo', title: 'Demo Category' };

  const layouts = [
    { key: 'brand', name: 'Brand Layout', component: BrandFlyout },
    { key: 'category', name: 'Category Layout', component: CategoryFlyout },
    { key: 'product', name: 'Product Layout', component: ProductFlyout }
  ];

  const ActiveFlyout = layouts.find(l => l.key === activeLayout)?.component || BrandFlyout;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">adidas</h1>
          <div className="flex space-x-4">
            {layouts.map(layout => (
              <button
                key={layout.key}
                onClick={() => setActiveLayout(layout.key)}
                className={`px-4 py-2 rounded transition-colors ${
                  activeLayout === layout.key 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {layout.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <p className="text-center text-gray-600 mb-4">
          Current Layout: <strong>{layouts.find(l => l.key === activeLayout)?.name}</strong>
        </p>
        <p className="text-center text-gray-500 text-sm">
          The flyout menu is displayed below. In a real implementation, it would overlay the content.
        </p>
      </div>

      {/* Flyout */}
      <ActiveFlyout
        activeCategory={mockCategory}
        flyoutOpen={flyoutOpen}
        flyoutPosition={flyoutPosition}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      />
    </div>
  );
};

export default FlyoutLayoutDemo;