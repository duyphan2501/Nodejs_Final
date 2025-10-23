import { Modal, Button, Paper } from "@mui/material";
import CustomInput from "../CustomInput";
import { useState } from "react";
import { useTableControl } from "../TableControl/TableControllerContext";
import CustomDropdown from "../CustomDropdown";

export default function CustomModalCouponAdd({ control }) {
  const { couponData } = useTableControl();
  const { openAddCoupon, setOpenAddCoupon } = control;
  const [addProductOpen, setAddProductOpen] = useState(false);

  // ✅ useState đúng cú pháp
  const [applicableProducts, setApplicableProducts] = useState([
    {
      name: "Nike Air Force 1 '07",
      brand: "Nike",
      price: 2500000,
      image:
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7d49ff1b-05b4-46dc-871b-20db681da27d/air-force-1-07-shoes-WrLlWX.png",
    },
    {
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: 3800000,
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/08c12ed99a5c47a5a8cdaf8f01123ef0_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    },
    {
      name: "Converse Chuck Taylor",
      brand: "Converse",
      price: 1800000,
      image:
        "https://converse.vn/media/catalog/product/cache/0b6e1b3d9ef1cddc13f9a4b2bb9c96d0/m/9/m9166_01.jpg",
    },
  ]);

  // ✅ Dữ liệu tất cả sản phẩm có thể chọn
  const productData = [
    {
      name: "Nike Air Force 1 '07",
      brand: "Nike",
      price: 2500000,
      image:
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7d49ff1b-05b4-46dc-871b-20db681da27d/air-force-1-07-shoes-WrLlWX.png",
    },
    {
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: 3800000,
      image:
        "https://assets.adidas.com/images/w_600,f_auto,q_auto/08c12ed99a5c47a5a8cdaf8f01123ef0_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    },
    {
      name: "Converse Chuck Taylor",
      brand: "Converse",
      price: 1800000,
      image:
        "https://converse.vn/media/catalog/product/cache/0b6e1b3d9ef1cddc13f9a4b2bb9c96d0/m/9/m9166_01.jpg",
    },
    {
      name: "Puma Suede Classic",
      brand: "Puma",
      price: 2100000,
      image:
        "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/356568/03/sv01/fnd/SEA/fmt/png/Suede-Classic-XXI-Unisex-Sneakers",
    },
    {
      name: "New Balance 550",
      brand: "New Balance",
      price: 3200000,
      image:
        "https://nb.scene7.com/is/image/NB/bb550wt1_nb_02_i?$pdpflexf2$&wid=440&hei=440",
    },
  ];

  const coupon = couponData[0];

  return (
    <Modal open={openAddCoupon} onClose={() => setOpenAddCoupon(false)}>
      <>
        <ModalAddProduct
          addProductOpen={addProductOpen}
          setAddProductOpen={setAddProductOpen}
          productData={productData}
          setApplicableProducts={setApplicableProducts}
          applicableProducts={applicableProducts}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px 40px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            minWidth: "80%",
            maxHeight: "600px",
            overflow: "auto",
          }}
        >
          {/* Nút lưu */}
          <div className="w-full flex justify-end mb-4">
            <Button
              variant="contained"
              sx={{
                width: "200px",
                padding: "10px 10px",
                background: "#00C950",
              }}
              onClick={() => setOpenAddCoupon(false)}
            >
              Lưu Thông Tin
            </Button>
          </div>

          {/* Cột phải - Chỉnh sửa */}
          <div className=" w-full">
            <h1 className="text-xl font-bold mb-2">Thêm Coupon</h1>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <CustomInput
                type="text"
                label="Mã Coupon"
                value={coupon.couponCode}
              />
              <CustomInput
                type="text"
                label="Mô tả"
                value={coupon.description}
              />
              <CustomInput
                type="number"
                label="Giá trị giảm"
                value={coupon.discountValue}
              />
              <div className="mb-2">
                <label className="text-black uppercase font-semibold">
                  Loại giảm giá
                </label>
                <CustomDropdown
                  type="coupon-edit"
                  choose={coupon.discountType}
                />
              </div>
              <CustomInput
                type="date"
                label="Ngày bắt đầu"
                value={coupon.startDate}
              />
              <CustomInput
                type="date"
                label="Ngày kết thúc"
                value={coupon.endDate}
              />
              <CustomInput
                type="number"
                label="Giá trị tối thiểu"
                value={coupon.minOrderValue}
              />
              <CustomInput
                type="number"
                label="Giảm tối đa"
                value={coupon.maxDiscount}
              />
            </div>

            {/* Danh sách giày áp dụng */}
            <h2 className="text-lg font-bold mt-6 mb-2">
              Sản phẩm áp dụng Coupon
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-2">
              <Paper
                key="add-new"
                onClick={() => setAddProductOpen(true)}
                sx={{
                  minWidth: "200px",
                  borderRadius: "12px",
                  border: "1px dashed #aaa",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  ":hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <span className="text-[100px] text-gray-500">+</span>
              </Paper>

              {applicableProducts.map((p, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    minWidth: "200px",
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-36 object-contain bg-gray-100"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                    <p className="text-sm text-green-600 font-bold mt-1">
                      {p.price.toLocaleString()}₫
                    </p>
                  </div>
                </Paper>
              ))}
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}

// 🧩 Modal chọn sản phẩm
const ModalAddProduct = ({
  addProductOpen,
  setAddProductOpen,
  productData,
  setApplicableProducts,
  applicableProducts,
}) => {
  const handleChange = (event, product) => {
    if (event.target.checked) {
      setApplicableProducts((prev) => {
        if (prev.find((p) => p.name === product.name)) return prev;
        return [...prev, product];
      });
    } else {
      setApplicableProducts((prev) =>
        prev.filter((p) => p.name !== product.name)
      );
    }
  };

  return (
    <Modal open={addProductOpen} onClose={() => setAddProductOpen(false)}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px 40px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          minWidth: "80%",
          maxHeight: "600px",
          overflow: "auto",
        }}
      >
        <h1 className="text-2xl font-bold mb-4">
          Chọn sản phẩm áp dụng Coupon
        </h1>

        <div className="grid sm:grid-cols-3 gap-4">
          {productData.map((p, idx) => (
            <Paper
              key={idx}
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                overflow: "hidden",
                padding: "8px",
              }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!applicableProducts.find((a) => a.name === p.name)}
                  onChange={(e) => handleChange(e, p)}
                />
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 object-contain bg-gray-100 rounded"
                />
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  <p className="text-sm text-green-600 font-bold mt-1">
                    {p.price.toLocaleString()}₫
                  </p>
                </div>
              </div>
            </Paper>
          ))}
        </div>

        <div className="w-full flex justify-end mt-4">
          <Button
            variant="contained"
            color="success"
            onClick={() => setAddProductOpen(false)}
          >
            Xong
          </Button>
        </div>
      </div>
    </Modal>
  );
};
