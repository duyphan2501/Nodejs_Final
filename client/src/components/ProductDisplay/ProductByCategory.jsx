import { useEffect, useState } from "react";
import ProductSlider from "../ProductSlider.jsx";
import ViewMoreBtn from "../ViewMoreBtn";
import useProductStore from "../../store/useProductStore.js";

const sampleProducts = [
  {
    _id: "p1",
    name: "Nike Air Force 1",
    category: "Nam chạy bộ",
    description: "Mẫu giày huyền thoại của Nike, phù hợp đi học, đi chơi.",
    variants: [
      {
        _id: "6728e9f1a000000000000001",
        color: "Trắng",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/478caedf11a74195924dddcf5cd3f57f_9366/Giay_Samba_OG_trang_JS3830_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e150dbf5955949458c5ab0acdb265b0a_9366/Giay_Samba_OG_trang_JS3830_02_standard_hover.jpg",
        ],
        price: 2200000,
        discount: 15,
        attributes: [
          { size: "41", inStock: 10 },
          { size: "42", inStock: 8 },
        ],
      },
      {
        _id: "6728e9f1a000000000000002",
        color: "Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/de1630d7be5241a1acd4f8ef197dde90_9366/Giay_Samba_OG_trang_JR8842_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/584f3152fed246dbbf58641316fd0361_9366/Giay_Samba_OG_trang_JR8842_02_standard_hover.jpg",
        ],
        price: 2200000,
        discount: 0,
        attributes: [
          { size: "41", inStock: 8 },
          { size: "42", inStock: 5 },
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
        _id: "6728e9f1a000000000000003",
        color: "Xám",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9223244731c64db4b066463220823278_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/458c9048cff44303b52543dc06f0d7f9_9366/Giay_Handball_Spezial_mau_xanh_la_JR2121_02_standard.jpg",
        ],
        price: 3500000,
        discount: 0,
        attributes: [
          { size: "40", inStock: 5 },
          { size: "41", inStock: 3 },
        ],
      },
      {
        _id: "6728e9f1a000000000000004",
        color: "Trắng",
        images: [
          "https://example.com/adidas-ub-white-front.jpg",
          "https://example.com/adidas-ub-white-side.jpg",
        ],
        price: 3500000,
        discount: 0,
        attributes: [
          { size: "41", inStock: 12 },
          { size: "42", inStock: 6 },
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
        _id: "6728e9f1a000000000000005",
        color: "Trắng",
        images: [
          "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/d2752ce688794cd5b1644593c41527fc_9366/giay-samba-jane.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0e7e9378a98c4cefa30db333e405ade8_9366/Giay_Samba_Jane_trang_JR7339_02_standard_hover.jpg",
        ],
        price: 1500000,
        discount: 0,
        attributes: [
          { size: "39", inStock: 20 },
          { size: "40", inStock: 10 },
        ],
      },
      {
        _id: "6728e9f1a000000000000006",
        color: "Đen",
        images: [
          "https://example.com/converse-ct-black-front.jpg",
          "https://example.com/converse-ct-black-side.jpg",
        ],
        price: 1500000,
        discount: 0,
        attributes: [
          { size: "39", inStock: 15 },
          { size: "40", inStock: 8 },
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
        _id: "6728e9f1a000000000000007",
        color: "Đỏ/Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4a43ec2a7e174d9ba0fab6e5f3a96269_9366/Giay_Samba_OG_trang_JR8843_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/57725f72fba142d0a0354151b66b016f_9366/Giay_Samba_OG_trang_JR8843_02_standard_hover.jpg",
        ],
        price: 4500000,
        discount: 0,
        attributes: [
          { size: "41", inStock: 7 },
          { size: "42", inStock: 4 },
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
        _id: "6728e9f1a000000000000008",
        color: "Trắng/Xanh lá",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3c60335d7c7c4807be39718386a44569_9366/GIAY_SUPERSTAR_II_Be_JQ3216_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4348854d12194203a5bac7d3de6dea43_9366/GIAY_SUPERSTAR_II_Be_JQ3216_02_standard_hover.jpg",
        ],
        price: 2000000,
        discount: 0,
        attributes: [
          { size: "40", inStock: 20 },
          { size: "41", inStock: 25 },
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
        _id: "6728e9f1a000000000000009",
        color: "Đen",
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/66f2b3dd5c9349598606b0f40b69efbe_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/34a838590e254d17b85c4052b825a8ad_9366/Giay_Mule_Adifom_IIInfinity_mau_xanh_la_JR9381_02_standard_hover.jpg",
        ],
        price: 2000000,
        discount: 15,
        attributes: [
          { size: "S", inStock: 18 },
          { size: "M", inStock: 1 },
        ],
      },
    ],
  },
];

const ProductByCategory = ({ category }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const getProductByCategorySlug = useProductStore(
    (s) => s.getProductByCategorySlug
  );

  const fetchProductsSlug = async () => {
    setLoading(false);
    const data = await getProductByCategorySlug(6, category.slug);
    setProducts(data);
    setLoading(true);
  };

  useEffect(() => {
    fetchProductsSlug();
  }, []);
  return (
    <div>
      <section className="mb-4">
        <div className="flex justify-between items-center">
          <h4 className="title uppercase font-bold text-3xl mb-3">
            {category.name}
          </h4>
          <div className="  ">
            <ViewMoreBtn />
          </div>
        </div>
      </section>
      <ProductSlider products={products} />
    </div>
  );
};

export default ProductByCategory;
