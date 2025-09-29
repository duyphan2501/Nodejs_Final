import { useState } from "react";
import ViewMoreBtn from "../ViewMoreBtn";
import ProductSlider from "../ProductSlider.jsx";

const sampleProducts = [
  {
    id: "p1",
    name: "Nike Air Force 1",
    category: "Nam chạy bộ",
    description: "Mẫu giày huyền thoại của Nike, phù hợp đi học, đi chơi.",
    variants: [
      {
        id: "v1",
        size: "41",
        color: "Trắng",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/478caedf11a74195924dddcf5cd3f57f_9366/Giay_Samba_OG_trang_JS3830_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e150dbf5955949458c5ab0acdb265b0a_9366/Giay_Samba_OG_trang_JS3830_02_standard_hover.jpg",
        ],
        price: 2200000,
        inStock: 10,
        discount: 15,
      },
      {
        id: "v2",
        size: "42",
        color: "Đen",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/de1630d7be5241a1acd4f8ef197dde90_9366/Giay_Samba_OG_trang_JR8842_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/584f3152fed246dbbf58641316fd0361_9366/Giay_Samba_OG_trang_JR8842_02_standard_hover.jpg",
        ],
        price: 2200000,
        inStock: 8,
      },
    ],
  },
  {
    id: "p2",
    name: "Adidas Ultraboost",
    category: "Nam chạy bộ",
    description: "Giày chạy bộ cao cấp với đệm Boost êm ái.",
    variants: [
      {
        id: "v3",
        size: "40",
        color: "Xám",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9223244731c64db4b066463220823278_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/458c9048cff44303b52543dc06f0d7f9_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_02_standard.jpg",
        ],
        price: 3500000,
        inStock: 5,
      },
      {
        id: "v4",
        size: "41",
        color: "Trắng",
        image: [
          "https://example.com/adidas-ub-white-front.jpg",
          "https://example.com/adidas-ub-white-side.jpg",
        ],
        price: 3500000,
        inStock: 12,
      },
    ],
  },
  {
    id: "p3",
    name: "Converse Chuck Taylor",
    category: "Nam chạy bộ",
    description: "Giày vải cổ điển, phong cách streetwear.",
    variants: [
      {
        id: "v5",
        size: "39",
        color: "Trắng",
        image: [
          "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/d2752ce688794cd5b1644593c41527fc_9366/giay-samba-jane.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0e7e9378a98c4cefa30db333e405ade8_9366/Giay_Samba_Jane_trang_JR7339_02_standard_hover.jpg",
        ],
        price: 1500000,
        inStock: 20,
      },
      {
        id: "v6",
        size: "40",
        color: "Đen",
        image: [
          "https://example.com/converse-ct-black-front.jpg",
          "https://example.com/converse-ct-black-side.jpg",
        ],
        price: 1500000,
        inStock: 15,
      },
    ],
  },
  {
    id: "p4",
    name: "Nike Air Jordan 1",
    category: "Nam chạy bộ",
    description: "Mẫu Jordan 1 cổ cao dành cho sneakerhead.",
    variants: [
      {
        id: "v7",
        size: "42",
        color: "Đỏ/Đen",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4a43ec2a7e174d9ba0fab6e5f3a96269_9366/Giay_Samba_OG_trang_JR8843_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/57725f72fba142d0a0354151b66b016f_9366/Giay_Samba_OG_trang_JR8843_02_standard_hover.jpg",
        ],
        price: 4500000,
        inStock: 7,
      },
    ],
  },
  {
    id: "p5",
    name: "Adidas Stan Smith",
    category: "Nam chạy bộ",
    description: "Mẫu giày tennis tối giản, dễ phối đồ.",
    variants: [
      {
        id: "v8",
        size: "41",
        color: "Trắng/Xanh lá",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3c60335d7c7c4807be39718386a44569_9366/GIAY_SUPERSTAR_II_Be_JQ3216_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4348854d12194203a5bac7d3de6dea43_9366/GIAY_SUPERSTAR_II_Be_JQ3216_02_standard_hover.jpg",
        ],
        price: 2000000,
        inStock: 25,
      },
    ],
  },
  {
    id: "p6",
    name: "Vans Old Skool",
    category: "Nam chạy bộ",
    description: "Giày Vans classic phong cách skate.",
    variants: [
      {
        id: "v9",
        size: "40",
        color: "Đen/Trắng",
        image: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/66f2b3dd5c9349598606b0f40b69efbe_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/34a838590e254d17b85c4052b825a8ad_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_02_standard_hover.jpg",
        ],
        price: 1600000,
        inStock: 18,
        discount: 10,
      },
    ],
  },
];

const FirstSection = () => {
  const [isBtnNewProduct, setIsBtnNewProduct] = useState(true);

  return (
    <div className="">
      <section className="mb-5">
        <div className="sm:flex justify-between items-center">
          <div className="p-1 rounded-md bg-gray-200 flex gap-2 w-fit">
            <button
              onClick={() => setIsBtnNewProduct(true)}
              className={`${
                isBtnNewProduct && "bg-white"
              } py-1 px-2 rounded-md cursor-pointer hover:bg-white transition`}
            >
              Sản phẩm mới
            </button>
            <button
              onClick={() => setIsBtnNewProduct(false)}
              className={`${
                !isBtnNewProduct && "bg-white"
              } py-1 px-2 rounded-md cursor-pointer hover:bg-white transition`}
            >
              Sản phẩm bán chạy
            </button>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <ViewMoreBtn href={""}>Xem thêm</ViewMoreBtn>
          </div>
        </div>
      </section>
      <section>
        <ProductSlider products={sampleProducts} />
      </section>
    </div>
  );
};

export default FirstSection;
