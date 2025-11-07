import createHttpError from "http-errors";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import CategoryModel from "../models/category.model.js";

const addOneProduct = async (product) => {
  try {
    const result = ProductModel.insertOne(product);

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteOneProduct = async (_id) => {
  try {
    const result = ProductModel.deleteOne({ _id });

    return result;
  } catch (error) {
    throw error;
  }
};

const getAllProductWithVariantStock = async () => {
  try {
    const result = await ProductModel.aggregate([
      {
        $lookup: {
          from: "variants",
          localField: "variants",
          foreignField: "_id",
          as: "variantData",
        },
      },
      {
        $lookup: {
          from: "evaluations",
          localField: "_id",
          foreignField: "productId",
          as: "evaluationData",
        },
      },
      {
        $project: {
          name: 1,
          brand: 1,
          inputPrice: 1,
          description: 1,
          categoryId: 1,
          totalStock: {
            $reduce: {
              input: "$variantData",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $reduce: {
                      input: { $ifNull: ["$$this.attributes", []] },
                      initialValue: 0,
                      in: {
                        $add: ["$$value", { $ifNull: ["$$this.inStock", 0] }],
                      },
                    },
                  },
                ],
              },
            },
          },
          image: {
            $first: {
              $first: { $ifNull: ["$variantData.images", []] },
            },
          },
          stars: {
            $avg: {
              $map: {
                input: "$evaluationData",
                as: "e",
                in: { $ifNull: ["$$e.rating", 0] },
              },
            },
          },
          totalRating: {
            $size: "$evaluationData",
          },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteManyProduct = async (_ids) => {
  try {
    const objectIds = _ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = ProductModel.deleteMany({
      _id: {
        $in: objectIds,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getProductBySlug = async (slug) => {
  if (!slug) throw createHttpError.BadRequest("Thiếu slug");
  const product = await ProductModel.findOne({ slug }).populate("variants");
  if (!product) throw createHttpError.NotFound("Sản phẩm không tồn tại");
  return product;
};

const fetchProducts = async (page, limit, sortOption, filterParams) => {
  const skipIndex = (page - 1) * limit;

  // --- 1. Xây dựng điều kiện Lọc cơ bản (Match Stage) ---
  let matchCriteria = {};

  if (filterParams.categoryId && filterParams.categoryId.length > 0) {
    matchCriteria.categoryId = { $in: filterParams.categoryId.map(id => new mongoose.Types.ObjectId(`${id}`)) }; 
  }
  
  if (filterParams.brand && filterParams.brand.length > 0) {
    matchCriteria.brand = { $in: filterParams.brand };
  }

  // --- 2. Xây dựng Pipeline ---
  let pipeline = [
    // Stage 1: Lọc cơ bản trước để giảm tải
    { $match: matchCriteria },

    // Stage 2: Join với Variants (Lookup)
    {
      $lookup: {
        from: "variants",
        localField: "variants",
        foreignField: "_id",
        as: "variantDetails",
      },
    },

    // Stage 3 (MỚI): Tạo trường giá trị của variant đầu tiên
    {
      $addFields: {
        // Lấy giá của phần tử đầu tiên trong mảng variantDetails
        // sau khi tính discount: price * (1 - discount/100)
        computedPrice: {
          $multiply: [
            { $arrayElemAt: ["$variantDetails.price", 0] }, // Lấy price của variant đầu tiên
            {
              $subtract: [
                1,
                {
                  $divide: [
                    { $arrayElemAt: ["$variantDetails.discount", 0] },
                    100,
                  ],
                }, // Lấy discount của variant đầu tiên
              ],
            },
          ],
        },
      },
    },
  ];

  // --- 3. Xử lý Lọc theo Min/Max Price (Sử dụng computedPrice) ---
  let priceMatch = {};

  if (filterParams.minPrice) {
    priceMatch.$gte = parseInt(filterParams.minPrice);
  }
  if (filterParams.maxPrice) {
    priceMatch.$lte = parseInt(filterParams.maxPrice);
  }

  if (Object.keys(priceMatch).length > 0) {
    pipeline.push({
      $match: { computedPrice: priceMatch },
    });
  }

  // --- 4. Xử lý Sắp xếp (Sort Stage) ---
  switch (sortOption) {
    case "price_asc":
      // Sắp xếp theo giá computedPrice vừa tính
      pipeline.push({ $sort: { computedPrice: 1, _id: 1 } });
      break;
    case "price_desc":
      // Sắp xếp theo giá computedPrice vừa tính
      pipeline.push({ $sort: { computedPrice: -1, _id: 1 } });
      break;
    // ... (các case khác cho name, createdAt) ...
    case "name_asc":
      pipeline.push({ $sort: { name: 1, _id: 1 } });
      break;
    case "name_desc":
      pipeline.push({ $sort: { name: -1, _id: 1 } });
      break;
    case "createdAt_asc":
      pipeline.push({ $sort: { createdAt: 1, _id: 1 } });
      break;
    case "createdAt_desc":
    default:
      pipeline.push({ $sort: { createdAt: -1, _id: 1 } });
      break;
  }

  // --- 5. Giai đoạn Phân trang ---
  pipeline.push({ $skip: skipIndex });
  pipeline.push({ $limit: limit });

  // --- 6. Thực thi Pipeline và Xử lý Count (như các bước trước) ---
  const products = await ProductModel.aggregate(pipeline).exec();

  // ... (logic tính count bằng pipeline riêng) ...
  const countPipeline = [...pipeline];
  countPipeline.pop();
  countPipeline.pop();
  countPipeline.push({ $count: "total" });
  const countResult = await ProductModel.aggregate(countPipeline);
  const count = countResult.length > 0 ? countResult[0].total : 0;
  const totalPages = Math.ceil(count / limit);

  // Gộp variantDetails đã join vào lại trường "variants" (như cũ)
  const finalProducts = products.map((product) => {
    product.variants = product.variantDetails;
    delete product.variantDetails;
    delete product.computedPrice; // Xóa trường giá tạm
    return product;
  });

  return {
    totalPages,
    products: finalProducts,
  };
};

const getAllBrandNames = async () => {
  const uniqueBrands = await ProductModel.distinct("brand");

  const formattedBrands = uniqueBrands.filter((brand) => brand !== null);

  return formattedBrands;
};


export {
  addOneProduct,
  deleteOneProduct,
  getAllProductWithVariantStock,
  deleteManyProduct,
  getProductBySlug,
  fetchProducts,
  getAllBrandNames,
};
