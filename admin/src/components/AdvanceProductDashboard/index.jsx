import {
  Box,
  capitalize,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Typography } from "@mui/material";
import { order } from "@mui/system";
import dayjs from "dayjs";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useProductStore from "../../../stores/useProductStore";
import { useEffect } from "react";

export default function AdvanceProductDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);

  // const [productData, setProductData] = useState([
  //   {
  //     product_id: 1,
  //     product_name: "Nike Air Max",
  //     price: 3500000,
  //     image:
  //       "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //   },
  //   {
  //     product_id: 2,
  //     product_name: "Converse Chuck",
  //     price: 2000000,
  //     image:
  //       "https://th.bing.com/th/id/R.a68738c22ecb47364c8f9ba32a63fe28?rik=C5TvVO0mEKNWfg&riu=http%3a%2f%2fwww.zappos.com%2fimages%2fz%2f2%2f5%2f4%2f3%2f7%2f5%2f2543755-5-4x.jpg&ehk=j7kqU3skCcmMYBBpJwNY8Xy1h%2beqPD%2bc8yGkbhuLrq4%3d&risl=&pid=ImgRaw&r=0",
  //   },
  //   {
  //     product_id: 3,
  //     product_name: "Vans Old Skool",
  //     price: 2200000,
  //     image:
  //       "https://th.bing.com/th/id/R.2914bb2869140c244a600e925e7476f7?rik=lu%2brKncvaFn5Og&riu=http%3a%2f%2fcdn.shopify.com%2fs%2ffiles%2f1%2f1202%2f6102%2fproducts%2fvans-old-skool-black-white-1_grande.jpg%3fv%3d1482167735&ehk=AsxaKGXZsgOINlFaAa22ITiOZhjNa8XC4ebCcNY%2fWI4%3d&risl=&pid=ImgRaw&r=0",
  //   },
  // ]);

  // const [orderData, setOrderData] = useState([
  //   {
  //     order_id: 1,
  //     date_created: "2025-09-01",
  //     items: [
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 1,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //       {
  //         product_id: 2,
  //         product_name: "Converse Chuck",
  //         quantity: 2,
  //         image:
  //           "https://upload.wikimedia.org/wikipedia/commons/0/0b/Converse_Chuck_Taylor_All_Stars_black.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 2,
  //     date_created: "2025-09-03",
  //     items: [
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 1,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 1,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 3,
  //     date_created: "2025-09-05",
  //     items: [
  //       {
  //         product_id: 2,
  //         product_name: "Converse Chuck",
  //         quantity: 2,
  //         image:
  //           "https://upload.wikimedia.org/wikipedia/commons/0/0b/Converse_Chuck_Taylor_All_Stars_black.jpg",
  //       },
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 1,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 4,
  //     date_created: "2025-09-07",
  //     items: [
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 2,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 1,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 5,
  //     date_created: "2025-09-10",
  //     items: [
  //       {
  //         product_id: 2,
  //         product_name: "Converse Chuck",
  //         quantity: 1,
  //         image:
  //           "https://upload.wikimedia.org/wikipedia/commons/0/0b/Converse_Chuck_Taylor_All_Stars_black.jpg",
  //       },
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 1,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 6,
  //     date_created: "2025-09-12",
  //     items: [
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 2,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 7,
  //     date_created: "2025-09-14",
  //     items: [
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 1,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //       {
  //         product_id: 2,
  //         product_name: "Converse Chuck",
  //         quantity: 1,
  //         image:
  //           "https://upload.wikimedia.org/wikipedia/commons/0/0b/Converse_Chuck_Taylor_All_Stars_black.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 8,
  //     date_created: "2025-09-16",
  //     items: [
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 1,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 2,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 9,
  //     date_created: "2025-09-18",
  //     items: [
  //       {
  //         product_id: 2,
  //         product_name: "Converse Chuck",
  //         quantity: 3,
  //         image:
  //           "https://upload.wikimedia.org/wikipedia/commons/0/0b/Converse_Chuck_Taylor_All_Stars_black.jpg",
  //       },
  //     ],
  //   },
  //   {
  //     order_id: 10,
  //     date_created: "2025-09-20",
  //     items: [
  //       {
  //         product_id: 1,
  //         product_name: "Nike Air Max",
  //         quantity: 1,
  //         image:
  //           "https://cdn.sanity.io/images/c1chvb1i/production/e4759700358563f876a4b7a936545e9a38de5c37-2000x1337.jpg/Air-Max-Light-Bone-1.jpg",
  //       },
  //       {
  //         product_id: 3,
  //         product_name: "Vans Old Skool",
  //         quantity: 2,
  //         image:
  //           "https://cdn.shopify.com/s/files/1/1202/6102/products/vans-old-skool-black-white-1_grande.jpg?v=1482167735",
  //       },
  //     ],
  //   },
  // ]);

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const productForChart = useProductStore((s) => s.productForChart);
  const orderForChart = useProductStore((s) => s.orderForChart);
  const getProductDashboardData = useProductStore(
    (s) => s.getProductDashboardData
  );

  useEffect(() => {
    getProductDashboardData(startDate, endDate);
  }, [startDate, endDate]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Các event cho chọn Product
  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirmSelection = () => {
    setIsProductModalOpen(false);
  };

  const getSelectedProductsData = () => {
    return productForChart.filter((product) =>
      selectedProducts.includes(product.product_id)
    );
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productForChart;
    return productForChart.filter((product) => {
      return product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [productForChart, searchTerm]);

  const chartData = useMemo(() => {
    const filtering = orderForChart
      .filter(
        (order) =>
          new Date(order.date_created) >= startDate &&
          new Date(order.date_created) <= endDate
      )
      .flatMap((order) => {
        return order.items.filter((item) =>
          selectedProducts.includes(item.product_id)
        );
      });

    let result = {};
    filtering.forEach((item) => {
      if (!result[item.product_id]) {
        result[item.product_id] = {
          total: 0,
          product_id: item.product_id,
          product_name: item.product_name,
        };
      }

      result[item.product_id].total += item.quantity;
    });
    return Object.values(result);
  }, [productForChart, orderForChart, startDate, endDate, selectedProducts]);

  // Cho chart
  const CustomTick = ({ x, y, payload }) => {
    const product = productForChart.find(
      (p) => p.product_name === payload.value
    );
    if (!product) return null;

    return (
      <g transform={`translate(0, ${y})`}>
        <image
          href={product.image}
          x={-50} // dịch sang trái
          y={-12} // căn giữa theo tick
          width={24}
          height={24}
        />
        <text
          x={0} // chữ cách ảnh
          y={0}
          dx={0}
          dy={4} // căn giữa theo tick
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="middle"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <>
      <Box
        boxShadow={1}
        padding={2}
        sx={{ background: "white", borderRadius: "10px" }}
      >
        <Typography variant="h6" textTransform={"capitalize"} mb={2}>
          Lượt bán các sản phẩm
        </Typography>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={dayjs(startDate).format("YYYY-MM-DD")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-sm mb-2">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={dayjs(endDate).format("YYYY-MM-DD")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="contained"
            onClick={() => setIsProductModalOpen(true)}
            sx={{ mb: 2 }}
          >
            Chọn sản phẩm ({selectedProducts.length})
          </Button>

          {selectedProducts.length > 0 && (
            <div className="mt-2">
              <Typography variant="subtitle2" className="mb-2">
                Sản phẩm đã chọn:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {getSelectedProductsData().map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-blue-100 px-2 py-1 rounded text-sm"
                  >
                    {product.product_name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 h-94">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="product_name"
                tick={<CustomTick />}
                width={150}
              />
              <Tooltip />
              <Bar dataKey="total" name={"Tổng cộng"} fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Box>

      {/* Dialog chọn Product  */}
      <Dialog
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chọn sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredProducts.map((product) => (
              <div key={product.product_id} className="border rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => handleProductToggle(product.product_id)}
                    />
                  }
                  label={
                    <div>
                      <div className="font-medium">{product.product_name}</div>
                      <div className="text-sm text-gray-500">
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy sản phẩm nào với từ khóa "{searchTerm}"
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsProductModalOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmSelection} variant="contained">
            Xác nhận ({selectedProducts.length})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
