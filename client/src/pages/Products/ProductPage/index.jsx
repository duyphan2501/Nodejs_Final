import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgMenuGridR } from "react-icons/cg";
import Sidebar from "../../../components/Sidebar";
import ProductItem from "../../../components/ProductItem.jsx";
import ProductListShape from "../../../components/ProductListShape";
import useProductStore from "../../../store/useProductStore";
import useCartStore from "../../../store/useCartStore.js";
import useUserStore from "../../../store/useUserStore.js";
import { useParams } from "react-router-dom";
import useCategoryStore from "../../../store/useCategoryStore.js";
import { useLocation } from "react-router-dom";

const ProductPage = () => {
  const [openSort, setOpenSort] = useState(false);
  const [totalPages, setTotalPages] = useState(10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt_desc");

  const [category, setCategory] = useState("");
  //Slug cua Category
  const { slug } = useParams();

  const location = useLocation();

  //Store chuyen slug => id
  const getCategoryIdBySlug = useCategoryStore((s) => s.getCategoryIdBySlug);

  //Store search products
  const searchProductArray = useProductStore((s) => s.searchProductsArray);
  const searchProducts = useProductStore((s) => s.searchProducts);

  const [filter, setFilter] = useState({
    categoryId: [],
    brand: [],
    minPrice: 0,
    maxPrice: 20000000,
  });

  const handleChangeFilter = (field, value) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: "createdAt_desc", label: "Mới nhất" },
    { value: "name_asc", label: "Tên, A-Z" },
    { value: "name_desc", label: "Tên, Z-A" },
    { value: "price_asc", label: "Giá, thấp đến cao" },
    { value: "price_desc", label: "Giá, cao đến thấp" },
  ];

  const [limit, setLimit] = useState(8);
  const [view, setView] = useState(0); // 0 for grid, 1 for list
  const sortRef = useRef(null);

  const handleOpenSort = () => {
    setOpenSort((prev) => !prev);
  };

  const { fetchProducts } = useProductStore();

  const fetchProductsAPI = async (
    page,
    limit,
    sortOption,
    filterParams,
    term
  ) => {
    setLoading(true);
    const { products, totalPages } = await fetchProducts(
      page,
      limit,
      sortOption,
      filterParams,
      term
    );
    setProducts(products);
    setTotalPages(totalPages);
    setLoading(false);
  };  

  useEffect(() => {
    const fetchInitial = async () => {
      if (slug) {
        const category = await getCategoryIdBySlug(slug);

        if (category) {
          setCategory(category);
          handleChangeFilter("categoryId", [category._id]);
        } else {
          const searchParams = new URLSearchParams(location.search);
          const term = searchParams.get("term");
          if (term) {
            setCategory({ name: term });
          } else {
            setCategory({ name: slug });
          }
          handleChangeFilter("categoryId", []);
        }
      } else {
        // Không có slug → reset filter
        setCategory("");
        handleChangeFilter("categoryId", []);
      }
    };

    fetchInitial();
  }, [slug]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term");

    fetchProductsAPI(currentPage, limit, sortBy, filter, term);
  }, [currentPage, sortBy, filter, limit]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    setOpenSort(false);
  };

  const user = useUserStore((state) => state.user);
  const { addToCart } = useCartStore();

  const handleAddToCart = async (item, quantity) => {
    await addToCart(item, quantity, user?._id);
  };

  // Tìm nhãn hiện tại đang được chọn để hiển thị trên nút Button
  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Sắp xếp";

  return (
    <main className="bg-white">
      <section className="lg:flex container gap-5 py-5">
        <div className="lg:w-1/5 bg-white lg:sticky top-7  self-start mb-5 my-7">
          {/* Sidebar đã nhận filter và hàm thay đổi filter */}
          <Sidebar filter={filter} handleChangeFilter={handleChangeFilter} />
        </div>
        <div className="lg:w-4/5 my-7">
          <div>
            <div className="rounded bg-gray-100 flex justify-between items-center p-2">
              <div className="">
                <FormControl sx={{ minWidth: 170 }} size="small">
                  <InputLabel id="limit-label">Số sản phẩm hiển thị</InputLabel>
                  <Select
                    labelId="limit-label"
                    value={limit}
                    label="Số sản phẩm hiển thị"
                    onChange={(e) => setLimit(e.target.value)}
                  >
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-center gap-1">
                <div className="">Sắp xếp theo:</div>
                <div className="relative " ref={sortRef}>
                  <Button
                    className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans"
                    onClick={handleOpenSort}
                  >
                    {currentSortLabel} {/* Hiển thị nhãn đang chọn */}
                  </Button>

                  {/* Menu Dropdown Sắp xếp */}
                  <ul
                    className={`absolute p-2 bg-white shadow-lg rounded-lg z-100 text-nowrap w-[200px] ${
                      !openSort
                        ? "top-1/2 opacity-0 invisible -right-2"
                        : "top-[100%] opacity-100 visible right-0"
                    } transition-all`}
                  >
                    {sortOptions.map((option) => (
                      <li key={option.value}>
                        <Button
                          className={`!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none ${
                            sortBy === option.value ? "!bg-gray-100" : "" // Highlight mục đang active
                          }`}
                          onClick={() => handleSortChange(option.value)} // Xử lý khi click
                        >
                          {option.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                {openSort && (
                  <div
                    className="fixed inset-0 z-50"
                    onClick={handleOpenSort}
                  ></div>
                )}
              </div>
            </div>

            <h4 className="mt-3 uppercase font-bold text-2xl">
              Kết quả {category?.name}:
            </h4>

            {/* Phần Render Sản phẩm */}
            <div className="my-4">
              {loading ? (
                <div>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? ( // <-- check products rỗng
                <div>Không có sản phẩm nào</div>
              ) : view === 0 ? (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 overflow-hidden">
                  {products.map((product) => (
                    <div key={product._id}>
                      <ProductItem
                        product={product}
                        addCart={(item, quantity) =>
                          handleAddToCart(item, quantity)
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {products.map((product) => (
                    <div key={product._id}>
                      <ProductListShape product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phần Pagination */}
            <div className="flex justify-center items-center my-6">
              <Stack spacing={2} sx={{ marginTop: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                />
              </Stack>
            </div>
            <div />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
