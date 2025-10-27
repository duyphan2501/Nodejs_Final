import { Button, IconButton, Pagination, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgMenuGridR } from "react-icons/cg";
import ProductItem from "../ProductItem.jsx";
import ProductListShape from "../ProductListShape";

const sampleProducts = [
  {
    _id: "p1",
    name: "Nike Air Force 1",
    category: "Nam chạy bộ",
    description: "Mẫu giày huyền thoại của Nike, phù hợp đi học, đi chơi.",
    variants: [
      {
        _id: "v1",
        color: "Trắng",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/478caedf11a74195924dddcf5cd3f57f_9366/Giay_Samba_OG_trang_JS3830_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e150dbf5955949458c5ab0acdb265b0a_9366/Giay_Samba_OG_trang_JS3830_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "41", price: 2200000, inStock: 10, discount: 15 },
          { size: "42", price: 2200000, inStock: 8 },
        ],
      },
      {
        _id: "v2",
        color: "Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/de1630d7be5241a1acd4f8ef197dde90_9366/Giay_Samba_OG_trang_JR8842_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/584f3152fed246dbbf58641316fd0361_9366/Giay_Samba_OG_trang_JR8842_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "41", price: 2200000, inStock: 8 },
          { size: "42", price: 2200000, inStock: 5 },
        ],
      },
    ],
  },
  {
    _id: "p2",
    name: "Adidas Ultraboost",
    category: "Nam chạy bộ",
    description: "Giày chạy bộ cao cấp với đệm Boost êm ái.",
    variants: [
      {
        _id: "v3",
        color: "Xám",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9223244731c64db4b066463220823278_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/458c9048cff44303b52543dc06f0d7f9_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_02_standard.jpg",
        ],
        attribute: [
          { size: "40", price: 3500000, inStock: 5 },
          { size: "41", price: 3500000, inStock: 3 },
        ],
      },
      {
        _id: "v4",
        color: "Trắng",
        images: [
          "https://example.com/adidas-ub-white-front.jpg",
          "https://example.com/adidas-ub-white-side.jpg",
        ],
        attribute: [
          { size: "41", price: 3500000, inStock: 12 },
          { size: "42", price: 3500000, inStock: 6 },
        ],
      },
    ],
  },
  {
    _id: "p3",
    name: "Converse Chuck Taylor",
    category: "Nam chạy bộ",
    description: "Giày vải cổ điển, phong cách streetwear.",
    variants: [
      {
        _id: "v5",
        color: "Trắng",
        images: [
          "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/d2752ce688794cd5b1644593c41527fc_9366/giay-samba-jane.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0e7e9378a98c4cefa30db333e405ade8_9366/Giay_Samba_Jane_trang_JR7339_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "39", price: 1500000, inStock: 20 },
          { size: "40", price: 1500000, inStock: 10 },
        ],
      },
      {
        _id: "v6",
        color: "Đen",
        images: [
          "https://example.com/converse-ct-black-front.jpg",
          "https://example.com/converse-ct-black-side.jpg",
        ],
        attribute: [
          { size: "39", price: 1500000, inStock: 15 },
          { size: "40", price: 1500000, inStock: 8 },
        ],
      },
    ],
  },
  {
    _id: "p4",
    name: "Nike Air Jordan 1",
    category: "Nam chạy bộ",
    description: "Mẫu Jordan 1 cổ cao dành cho sneakerhead.",
    variants: [
      {
        _id: "v7",
        color: "Đỏ/Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4a43ec2a7e174d9ba0fab6e5f3a96269_9366/Giay_Samba_OG_trang_JR8843_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/57725f72fba142d0a0354151b66b016f_9366/Giay_Samba_OG_trang_JR8843_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "41", price: 4500000, inStock: 7 },
          { size: "42", price: 4500000, inStock: 4 },
        ],
      },
    ],
  },
  {
    _id: "p5",
    name: "Adidas Stan Smith",
    category: "Nam chạy bộ",
    description: "Mẫu giày tennis tối giản, dễ phối đồ.",
    variants: [
      {
        _id: "v8",
        color: "Trắng/Xanh lá",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3c60335d7c7c4807be39718386a44569_9366/GIAY_SUPERSTAR_II_Be_JQ3216_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4348854d12194203a5bac7d3de6dea43_9366/GIAY_SUPERSTAR_II_Be_JQ3216_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "40", price: 2000000, inStock: 20 },
          { size: "41", price: 2000000, inStock: 25 },
        ],
      },
    ],
  },
  {
    _id: "p6",
    name: "Vans Old Skool",
    category: "Nam chạy bộ",
    description: "Giày Vans classic phong cách skate.",
    variants: [
      {
        _id: "v9",
        color: "Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/66f2b3dd5c9349598606b0f40b69efbe_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/34a838590e254d17b85c4052b825a8ad_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_02_standard_hover.jpg",
        ],
        attribute: [
          { size: "S", price: 1600000, inStock: 18, discount: 10 },
          { size: "M", price: 2000000, inStock: 1, discount: 15 },
        ],
      },
    ],
  },
];

const ProductGridView = () => {
  const [openSort, setOpenSort] = useState(false);
  const [products, setProducts] = useState(sampleProducts || []);
  const [view, setView] = useState(0); // 0 for grid, 1 for list
  const sortRef = useRef(null);

  const handleOpenSort = () => {
    setOpenSort((prev) => !prev);
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <div className="rounded bg-gray-100 flex justify-between items-center p-2">
        <div className="flex items-center">
          <IconButton
            variant="text"
            className={`!size-[40px] !min-w-[40px] !rounded-full  !text-black hover:!bg-gray-200 !transition ${
              view === 0 ? "!bg-gray-200" : ""
            }`}
            onClick={() => handleChangeView(0)}
          >
            <CgMenuGridR size={15} className="pointer-events-none" />
          </IconButton>
          <IconButton
            variant="text"
            className={`!size-[40px] !min-w-[40px]!rounded-full  !text-black hover:!bg-gray-200 !transition ${
              view === 1 ? "!bg-gray-200" : ""
            }`}
            onClick={() => handleChangeView(1)}
          >
            <GiHamburgerMenu size={15} className="pointer-events-none" />
          </IconButton>

          <span className="ml-2 text-[15px]">Có 35 sản phẩm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="">Sắp xếp theo:</div>
          <div className="relative " ref={sortRef}>
            <Button
              className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans"
              onClick={handleOpenSort}
            >
              Tên, A-Z
            </Button>
            <ul
              className={`absolute p-2 bg-white shadow-lg rounded-lg z-100 text-nowrap w-[150px] ${
                !openSort
                  ? "top-1/2 opacity-0 invisible -right-2"
                  : "top-[100%] opacity-100 visible right-0"
              } transition-all`}
            >
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Tên, A-Z
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Tên, Z-A
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Giá, thấp đến cao
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Giá, cao đến thấp
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-4">
        {view === 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 overflow-hidden">
            {products && products.map((product) => {
              return (
                <div key={product._id}>
                  <ProductItem
                    product={product}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product) => {
              return (
                <div className="" key={product._id}>
                  <ProductListShape
                    product={product}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center my-6">
        <Stack spacing={2}>
          <Pagination count={10} showFirstButton showLastButton />
        </Stack>
      </div>
      <div />
    </div>
  );
};

export default ProductGridView;
