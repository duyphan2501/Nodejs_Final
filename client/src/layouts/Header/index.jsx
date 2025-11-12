import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import useCategoryStore from "../../store/useCategoryStore";
import useProductStore from "../../store/useProductStore";

// Mock API function
// const fetchMenuData = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return {
//     categories: [
//       // Flyout Menu 1 - Shoes Focus
//       {
//         id: "shoes",
//         type: "shoes",
//         title: "GIÀY",

//         sections: [
//           {
//             title: "GIÀY HÀNG MỚI VỀ",
//             items: [
//               { name: "SL 72", link: "/shoes/sl72" },
//               { name: "Stan Smith", link: "/shoes/stan-smith" },
//               { name: "Low Profile Collection", link: "/shoes/low-profile" },
//             ],
//           },
//           {
//             title: "TRENDING SHOES",
//             items: [
//               { name: "Every Day Running", link: "/shoes/running" },
//               { name: "Tiếp sức đường chạy", link: "/shoes/running-support" },
//               { name: "Race to win", link: "/shoes/race" },
//               { name: "Giày đi bộ", link: "/shoes/walking" },
//             ],
//           },
//         ],
//         featured: [
//           { name: "SAMBA", image: "/images/samba.jpg", link: "/shoes/samba" },
//           {
//             name: "GAZELLE",
//             image: "/images/gazelle.jpg",
//             link: "/shoes/gazelle",
//           },
//           {
//             name: "CAMPUS",
//             image: "/images/campus.jpg",
//             link: "/shoes/campus",
//           },
//           {
//             name: "SPEZIAL",
//             image: "/images/spezial.jpg",
//             link: "/shoes/spezial",
//           },
//           {
//             name: "SUPERSTAR",
//             image: "/images/superstar.jpg",
//             link: "/shoes/superstar",
//           },
//           { name: "SAMBA", image: "/images/samba.jpg", link: "/shoes/samba" },
//           {
//             name: "GAZELLE",
//             image: "/images/gazelle.jpg",
//             link: "/shoes/gazelle",
//           },
//           {
//             name: "CAMPUS",
//             image: "/images/campus.jpg",
//             link: "/shoes/campus",
//           },
//           {
//             name: "SPEZIAL",
//             image: "/images/spezial.jpg",
//             link: "/shoes/spezial",
//           },
//           {
//             name: "SUPERSTAR",
//             image: "/images/superstar.jpg",
//             link: "/shoes/superstar",
//           },
//         ],
//       },

//       // Flyout Menu 2 - Man Flyout
//       // {
//       //   id: "man",
//       //   type: "remaining",
//       //   title: "Nam",
//       //   sections: [
//       //     {
//       //       title: "NỔI BẬT",
//       //       items: [
//       //         { name: "Hàng Mới Về", link: "/new-arrivals" },
//       //         { name: "Độc quyền hội viên", link: "/member-exclusive" },
//       //       ],
//       //     },
//       //     {
//       //       title: "ĐƯỢC YÊU THÍCH TRONG THÁNG",
//       //       items: [
//       //         { name: "LIVERPOOL FC 25/26 KITS", link: "/liverpool-kits" },
//       //         { name: "Slide into Summer", link: "/summer-collection" },
//       //         { name: "Superstar", link: "/superstar" },
//       //         { name: "Low Profile Collection", link: "/low-profile" },
//       //         { name: "T-toe Collection", link: "/t-toe" },
//       //         { name: "Padel Tennis", link: "/padel-tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   categories: [
//       //     {
//       //       title: "GIÀY",
//       //       items: [
//       //         { name: "Hàng mới về", link: "/shoes/new" },
//       //         { name: "Originals", link: "/shoes/originals" },
//       //         { name: "Bóng đá", link: "/shoes/football" },
//       //         { name: "Chạy bộ", link: "/shoes/running" },
//       //         { name: "Tập", link: "/shoes/training" },
//       //         { name: "Ngoài trời", link: "/shoes/outdoor" },
//       //         { name: "Bóng rổ", link: "/shoes/basketball" },
//       //         { name: "Dép & Dép xỏ ngón", link: "/shoes/slides" },
//       //         { name: "Quần vợt", link: "/shoes/tennis" },
//       //         { name: "Sportswear", link: "/shoes/sportswear" },
//       //         { name: "Giày sneaker đen", link: "/shoes/black-sneakers" },
//       //         { name: "Đánh gôn", link: "/shoes/golf" },
//       //         { name: 'GIÀY "MUST-HAVE"', link: "/shoes/must-have" },
//       //         { name: "Walking Shoes", link: "/shoes/walking" },
//       //       ],
//       //     },
//       //     {
//       //       title: "QUẦN ÁO",
//       //       items: [
//       //         { name: "Áo thun & Áo polo", link: "/clothing/tshirts" },
//       //         { name: "Áo Jersey", link: "/clothing/jerseys" },
//       //         { name: "Áo hoodie", link: "/clothing/hoodies" },
//       //         { name: "Bộ đồ thể thao", link: "/clothing/tracksuits" },
//       //         { name: "Quần", link: "/clothing/pants" },
//       //         { name: "Quần bơ", link: "/clothing/swimwear" },
//       //         { name: "Quần short", link: "/clothing/shorts" },
//       //         { name: "Sportswear", link: "/clothing/sportswear" },
//       //         { name: "Áo khoác", link: "/clothing/jackets" },
//       //         { name: "CỠ BẢN", link: "/clothing/basics" },
//       //         { name: "Tracksuits", link: "/clothing/tracksuits-full" },
//       //       ],
//       //     },
//       //     {
//       //       title: "PHỤ KIỆN",
//       //       items: [
//       //         { name: "Tất Cả Túi", link: "/accessories/bags" },
//       //         { name: "Tất", link: "/accessories/socks" },
//       //         { name: "Mũ Lưỡi Trai & Đội Đầu", link: "/accessories/hats" },
//       //         { name: "Găng Tay", link: "/accessories/gloves" },
//       //         {
//       //           name: "Ốp bao vệ ống chân & Băng buộc",
//       //           link: "/accessories/protection",
//       //         },
//       //         { name: "Ball", link: "/accessories/balls" },
//       //       ],
//       //     },
//       //     {
//       //       title: "THỂ THAO",
//       //       items: [
//       //         { name: "Bóng đá", link: "/sports/football" },
//       //         { name: "Chạy", link: "/sports/running" },
//       //         { name: "Tập luyện", link: "/sports/training" },
//       //         { name: "Basketball", link: "/sports/basketball" },
//       //         { name: "Bơi lội", link: "/sports/swimming" },
//       //         { name: "Đánh gôn", link: "/sports/golf" },
//       //         { name: "Quần vợt", link: "/sports/tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   promotion: {
//       //     title: "EVO SL. FEEL FAST.",
//       //     image: "/images/evo-sl-promotion.jpg",
//       //     link: "/evo-sl-collection",
//       //   },
//       //   bottomCategories: [
//       //     { name: "Tất cả sản phẩm dành cho nam", link: "/men/all" },
//       //     { name: "Tất cả giày nam", link: "/men/shoes/all" },
//       //     {
//       //       name: "Tất cả phụ kiện dành cho nam",
//       //       link: "/men/accessories/all",
//       //     },
//       //     { name: "All Men's Sports", link: "/men/sports/all" },
//       //   ],
//       // },

//       // Flyout Menu 3 - woman Flyout
//       // {
//       //   id: "woman",
//       //   type: "remaining",
//       //   title: "Nữ",
//       //   sections: [
//       //     {
//       //       title: "NỔI BẬT",
//       //       items: [
//       //         { name: "Hàng Mới Về", link: "/new-arrivals" },
//       //         { name: "Độc quyền hội viên", link: "/member-exclusive" },
//       //       ],
//       //     },
//       //     {
//       //       title: "ĐƯỢC YÊU THÍCH TRONG THÁNG",
//       //       items: [
//       //         { name: "LIVERPOOL FC 25/26 KITS", link: "/liverpool-kits" },
//       //         { name: "Slide into Summer", link: "/summer-collection" },
//       //         { name: "Superstar", link: "/superstar" },
//       //         { name: "Low Profile Collection", link: "/low-profile" },
//       //         { name: "T-toe Collection", link: "/t-toe" },
//       //         { name: "Padel Tennis", link: "/padel-tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   categories: [
//       //     {
//       //       title: "GIÀY",
//       //       items: [
//       //         { name: "Hàng mới về", link: "/shoes/new" },
//       //         { name: "Originals", link: "/shoes/originals" },
//       //         { name: "Bóng đá", link: "/shoes/football" },
//       //         { name: "Chạy bộ", link: "/shoes/running" },
//       //         { name: "Tập", link: "/shoes/training" },
//       //         { name: "Ngoài trời", link: "/shoes/outdoor" },
//       //         { name: "Bóng rổ", link: "/shoes/basketball" },
//       //         { name: "Dép & Dép xỏ ngón", link: "/shoes/slides" },
//       //         { name: "Quần vợt", link: "/shoes/tennis" },
//       //         { name: "Sportswear", link: "/shoes/sportswear" },
//       //         { name: "Giày sneaker đen", link: "/shoes/black-sneakers" },
//       //         { name: "Đánh gôn", link: "/shoes/golf" },
//       //         { name: 'GIÀY "MUST-HAVE"', link: "/shoes/must-have" },
//       //         { name: "Walking Shoes", link: "/shoes/walking" },
//       //       ],
//       //     },
//       //     {
//       //       title: "QUẦN ÁO",
//       //       items: [
//       //         { name: "Áo thun & Áo polo", link: "/clothing/tshirts" },
//       //         { name: "Áo Jersey", link: "/clothing/jerseys" },
//       //         { name: "Áo hoodie", link: "/clothing/hoodies" },
//       //         { name: "Bộ đồ thể thao", link: "/clothing/tracksuits" },
//       //         { name: "Quần", link: "/clothing/pants" },
//       //         { name: "Quần bơ", link: "/clothing/swimwear" },
//       //         { name: "Quần short", link: "/clothing/shorts" },
//       //         { name: "Sportswear", link: "/clothing/sportswear" },
//       //         { name: "Áo khoác", link: "/clothing/jackets" },
//       //         { name: "CỠ BẢN", link: "/clothing/basics" },
//       //         { name: "Tracksuits", link: "/clothing/tracksuits-full" },
//       //       ],
//       //     },
//       //     {
//       //       title: "PHỤ KIỆN",
//       //       items: [
//       //         { name: "Tất Cả Túi", link: "/accessories/bags" },
//       //         { name: "Tất", link: "/accessories/socks" },
//       //         { name: "Mũ Lưỡi Trai & Đội Đầu", link: "/accessories/hats" },
//       //         { name: "Găng Tay", link: "/accessories/gloves" },
//       //         {
//       //           name: "Ốp bao vệ ống chân & Băng buộc",
//       //           link: "/accessories/protection",
//       //         },
//       //         { name: "Ball", link: "/accessories/balls" },
//       //       ],
//       //     },
//       //     {
//       //       title: "THỂ THAO",
//       //       items: [
//       //         { name: "Bóng đá", link: "/sports/football" },
//       //         { name: "Chạy", link: "/sports/running" },
//       //         { name: "Tập luyện", link: "/sports/training" },
//       //         { name: "Basketball", link: "/sports/basketball" },
//       //         { name: "Bơi lội", link: "/sports/swimming" },
//       //         { name: "Đánh gôn", link: "/sports/golf" },
//       //         { name: "Quần vợt", link: "/sports/tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   promotion: {
//       //     title: "EVO SL. FEEL FAST.",
//       //     image: "/images/evo-sl-promotion.jpg",
//       //     link: "/evo-sl-collection",
//       //   },
//       //   bottomCategories: [
//       //     { name: "Tất cả sản phẩm dành cho nam", link: "/men/all" },
//       //     { name: "Tất cả giày nam", link: "/men/shoes/all" },
//       //     {
//       //       name: "Tất cả phụ kiện dành cho nam",
//       //       link: "/men/accessories/all",
//       //     },
//       //     { name: "All Men's Sports", link: "/men/sports/all" },
//       //   ],
//       // },

//       // Flyout Menu 4 - Kids Flyout
//       // {
//       //   id: "kid",
//       //   type: "remaining",
//       //   title: "Trẻ em",
//       //   sections: [
//       //     {
//       //       title: "NỔI BẬT",
//       //       items: [
//       //         { name: "Hàng Mới Về", link: "/new-arrivals" },
//       //         { name: "Độc quyền hội viên", link: "/member-exclusive" },
//       //       ],
//       //     },
//       //     {
//       //       title: "ĐƯỢC YÊU THÍCH TRONG THÁNG",
//       //       items: [
//       //         { name: "LIVERPOOL FC 25/26 KITS", link: "/liverpool-kits" },
//       //         { name: "Slide into Summer", link: "/summer-collection" },
//       //         { name: "Superstar", link: "/superstar" },
//       //         { name: "Low Profile Collection", link: "/low-profile" },
//       //         { name: "T-toe Collection", link: "/t-toe" },
//       //         { name: "Padel Tennis", link: "/padel-tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   categories: [
//       //     {
//       //       title: "GIÀY",
//       //       items: [
//       //         { name: "Hàng mới về", link: "/shoes/new" },
//       //         { name: "Originals", link: "/shoes/originals" },
//       //         { name: "Bóng đá", link: "/shoes/football" },
//       //         { name: "Chạy bộ", link: "/shoes/running" },
//       //         { name: "Tập", link: "/shoes/training" },
//       //         { name: "Ngoài trời", link: "/shoes/outdoor" },
//       //         { name: "Bóng rổ", link: "/shoes/basketball" },
//       //         { name: "Dép & Dép xỏ ngón", link: "/shoes/slides" },
//       //         { name: "Quần vợt", link: "/shoes/tennis" },
//       //         { name: "Sportswear", link: "/shoes/sportswear" },
//       //         { name: "Giày sneaker đen", link: "/shoes/black-sneakers" },
//       //         { name: "Đánh gôn", link: "/shoes/golf" },
//       //         { name: 'GIÀY "MUST-HAVE"', link: "/shoes/must-have" },
//       //         { name: "Walking Shoes", link: "/shoes/walking" },
//       //       ],
//       //     },
//       //     {
//       //       title: "QUẦN ÁO",
//       //       items: [
//       //         { name: "Áo thun & Áo polo", link: "/clothing/tshirts" },
//       //         { name: "Áo Jersey", link: "/clothing/jerseys" },
//       //         { name: "Áo hoodie", link: "/clothing/hoodies" },
//       //         { name: "Bộ đồ thể thao", link: "/clothing/tracksuits" },
//       //         { name: "Quần", link: "/clothing/pants" },
//       //         { name: "Quần bơ", link: "/clothing/swimwear" },
//       //         { name: "Quần short", link: "/clothing/shorts" },
//       //         { name: "Sportswear", link: "/clothing/sportswear" },
//       //         { name: "Áo khoác", link: "/clothing/jackets" },
//       //         { name: "CỠ BẢN", link: "/clothing/basics" },
//       //         { name: "Tracksuits", link: "/clothing/tracksuits-full" },
//       //       ],
//       //     },
//       //     {
//       //       title: "PHỤ KIỆN",
//       //       items: [
//       //         { name: "Tất Cả Túi", link: "/accessories/bags" },
//       //         { name: "Tất", link: "/accessories/socks" },
//       //         { name: "Mũ Lưỡi Trai & Đội Đầu", link: "/accessories/hats" },
//       //         { name: "Găng Tay", link: "/accessories/gloves" },
//       //         {
//       //           name: "Ốp bao vệ ống chân & Băng buộc",
//       //           link: "/accessories/protection",
//       //         },
//       //         { name: "Ball", link: "/accessories/balls" },
//       //       ],
//       //     },
//       //     {
//       //       title: "THỂ THAO",
//       //       items: [
//       //         { name: "Bóng đá", link: "/sports/football" },
//       //         { name: "Chạy", link: "/sports/running" },
//       //         { name: "Tập luyện", link: "/sports/training" },
//       //         { name: "Basketball", link: "/sports/basketball" },
//       //         { name: "Bơi lội", link: "/sports/swimming" },
//       //         { name: "Đánh gôn", link: "/sports/golf" },
//       //         { name: "Quần vợt", link: "/sports/tennis" },
//       //       ],
//       //     },
//       //   ],
//       //   promotion: {
//       //     title: "EVO SL. FEEL FAST.",
//       //     image: "/images/evo-sl-promotion.jpg",
//       //     link: "/evo-sl-collection",
//       //   },
//       //   bottomCategories: [
//       //     { name: "Tất cả sản phẩm dành cho nam", link: "/men/all" },
//       //     { name: "Tất cả giày nam", link: "/men/shoes/all" },
//       //     {
//       //       name: "Tất cả phụ kiện dành cho nam",
//       //       link: "/men/accessories/all",
//       //     },
//       //     { name: "All Men's Sports", link: "/men/sports/all" },
//       //   ],
//       // },
//       // Flyout Menu 5 - Collections Flyout
//       // {
//       //   id: "collection",
//       //   type: "collections",
//       //   title: "BỘ SƯU TẬP",
//       //   brands: [
//       //     {
//       //       title: "ORIGINALS",
//       //       image:
//       //         "https://tse2.mm.bing.net/th/id/OIP._JbSL_liDg1eZjTBzoBFMQHaEo?rs=1&pid=ImgDetMain&o=7&rm=3",
//       //       items: [
//       //         { name: "Hàng Mới Về", link: "/originals/new" },
//       //         { name: "Giày", link: "/originals/shoes" },
//       //         { name: "Quần áo", link: "/originals/clothing" },
//       //         { name: "Phụ kiện", link: "/originals/accessories" },
//       //         { name: "Superstar", link: "/originals/superstar" },
//       //         { name: "Samba", link: "/originals/samba" },
//       //         { name: "Gazelle", link: "/originals/gazelle" },
//       //         { name: "Spezial", link: "/originals/spezial" },
//       //         { name: "SL 72", link: "/originals/sl72" },
//       //         { name: "Bộ sưu tập Premium", link: "/originals/premium" },
//       //         { name: "Bộ sưu tập T-Toe", link: "/originals/t-toe" },
//       //       ],
//       //     },
//       //     {
//       //       title: "ADIDAS ATHLETICS",
//       //       image:
//       //         "https://cdn3.ivivu.com/2015/06/20-canh-dep-noi-tieng-cua-ha-lan-ivivu-5.jpg",
//       //       items: [
//       //         { name: "Giày", link: "/athletics/shoes" },
//       //         { name: "Quần áo", link: "/athletics/clothing" },
//       //         { name: "Hàng Mới Về", link: "/athletics/new" },
//       //         { name: "Ultraboost DNA", link: "/athletics/ultraboost" },
//       //         { name: "Adilette", link: "/athletics/adilette" },
//       //         { name: "Essentials", link: "/athletics/essentials" },
//       //         { name: "Z.N.E", link: "/athletics/zne" },
//       //       ],
//       //     },
//       //     {
//       //       title: "TERREX",
//       //       image:
//       //         "https://www.tourchauau.net/images/news/tin-tuc-du-lich/10-canh-dep-noi-tieng-ha-lan-1.jpg",
//       //       items: [
//       //         { name: "About Terrex", link: "/terrex/about" },
//       //         { name: "Giày", link: "/terrex/shoes" },
//       //         { name: "Quần áo", link: "/terrex/clothing" },
//       //         { name: "Phụ kiện", link: "/terrex/accessories" },
//       //       ],
//       //     },
//       //     {
//       //       title: "Y-3",
//       //       image:
//       //         "https://tse1.mm.bing.net/th/id/OIP.WHX-FEw7gp8hxitUXWYz7QHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
//       //       items: [
//       //         { name: "giay", link: "/y3/shoes" },
//       //         { name: "quan_ao", link: "/y3/clothing" },
//       //         { name: "phu_kien", link: "/y3/accessories" },
//       //       ],
//       //     },
//       //   ],
//       // },
//     ],
//   };
// };

const Header = ({
  logoText = "Thrift Shop",

  customLogo = null,
}) => {
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

  const handleMobileSubcategoryClick = (subcategory) => {
    setMobileActiveSubcategory(subcategory);
    setMobileBreadcrumb([mobileActiveCategory.title, subcategory.name]);
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
          className={`p-0 transform transition-transform duration-300 ${
            mobileActiveSubcategory ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-4 max-h-[90vh] overflow-y-auto">
            {mobileActiveSubcategory.items.map((item, index) => (
              <a
                key={index}
                href={item.link || "#"}
                className="block py-2 text-gray-800 hover:text-black border-b border-gray-100 last:border-b-0 transform transition-all duration-200 hover:translate-x-1"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (mobileActiveCategory) {
      return (
        <div
          className={`p-0 transform transition-transform duration-300 ${
            mobileActiveCategory ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-0">
            {mobileActiveCategory?.categories?.map((sub, index) => (
              <button
                key={index}
                onClick={() => handleMobileSubcategoryClick(sub)}
                className="w-full flex items-center justify-between py-4 text-left text-gray-800 hover:text-black border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-50 hover:translate-x-1"
              >
                <span className="font-medium">{sub.title}</span>
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
        className={`p-4 space-y-0 transform transition-transform duration-300 ${
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
              ? mobileActiveSubcategory.name
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
