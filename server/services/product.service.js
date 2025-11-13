import createHttpError from "http-errors";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import CategoryModel from "../models/category.model.js";
import OrderModel from "../models/order.model.js";

const getAllProductDashboard = async () => {
  try {
    const res = ProductModel.aggregate([
      {
        $lookup: {
          from: "variants",
          localField: "variants",
          foreignField: "_id",
          as: "variantData",
        },
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          product_name: "$name",
          price: "$inputPrice",
          image: {
            $let: {
              vars: { firstVariant: { $arrayElemAt: ["$variantData", 0] } },
              in: { $arrayElemAt: ["$$firstVariant.images", 0] },
            },
          },
        },
      },
    ]);

    return res;
  } catch (error) {
    throw error;
  }
};

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
          variants: 1,

          // ✅ GIỮ LẠI TOÀN BỘ DỮ LIỆU BIẾN THỂ
          variantData: 1,

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

const fetchProducts = async (page, limit, sortOption, filterParams, terms) => {
  const skipIndex = (page - 1) * limit;

  // --- 1. Xây dựng điều kiện Lọc cơ bản (Match Stage) ---
  let matchCriteria = {};
  let matchTerm = {};

  if (filterParams.categoryId && filterParams.categoryId.length > 0) {
    matchCriteria.categoryId = {
      $in: filterParams.categoryId.map(
        (id) => new mongoose.Types.ObjectId(`${id}`)
      ),
    };
  }

  if (filterParams.brand && filterParams.brand.length > 0) {
    matchCriteria.brand = { $in: filterParams.brand };
  }

  if (terms && Array.isArray(terms) && terms.length > 0) {
    matchTerm.$or = terms.map((t) => {
      const regex = new RegExp(t.trim(), "i");
      return {
        $or: [
          { name: { $regex: regex } },
          { "categoryId.name": { $regex: regex } },
        ],
      };
    });
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

    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryId",
      },
    },

    {
      $unwind: "$categoryId",
    },

    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$doc" },
    },

    { $match: matchTerm },

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

const getProductQuantity = async () => {
  try {
    const result = ProductModel.aggregate([
      // 1️⃣ Join categories để lấy parentId
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },

      // 2️⃣ Group theo parentId của category
      {
        $group: {
          _id: "$categoryData.parentId",
          total: { $sum: 1 },
        },
      },

      // 3️⃣ Union với tất cả parent categories (total = 0)
      {
        $unionWith: {
          coll: "categories",
          pipeline: [
            { $match: { parentId: null } },
            {
              $project: {
                _id: "$_id",
                total: { $literal: 0 },
              },
            },
          ],
        },
      },

      // 4️⃣ Gộp lại (nếu có trùng _id thì lấy total lớn nhất)
      {
        $group: {
          _id: "$_id",
          total: { $max: "$total" },
        },
      },

      // 5️⃣ Join sang categories để lấy tên parent
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: {
          path: "$parentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 6️⃣ Hiển thị kết quả cuối cùng
      {
        $project: {
          _id: 1,
          parentName: "$parentCategory.name",
          total: 1,
        },
      },

      // 7️⃣ Sắp xếp cho đẹp (tuỳ chọn)
      {
        $sort: { parentName: 1 },
      },
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};

// Lấy top 3 sản phẩm mới
const getTopNNewProducts = async (n, type) => {
  try {
    const pipeline = [
      { $sort: { createdAt: -1 } },
      { $limit: n },

      // Join categories
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      // Lấy category đầu tiên (hoặc tất cả nếu muốn)

      {
        $lookup: {
          from: "categories",
          localField: "categoryId.parentId",
          foreignField: "_id",
          as: "parent",
        },
      },

      // Join variants
      {
        $lookup: {
          from: "variants",
          localField: "variants",
          foreignField: "_id",
          as: "variants", // tất cả variants của product
        },
      },

      // Match theo parent slug nếu có
      ...(type ? [{ $match: { "parent.slug": type } }] : []),
    ];

    const products = await ProductModel.aggregate(pipeline);
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Lấy top 3 sản phẩm bán chạy nhất
const getTopNBestSellingProducts = async (n, type) => {
  try {
    const result = await OrderModel.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.variantId",
          totalQuantityPerVariant: { $sum: "$items.quantity" },
        },
      },

      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "_id",
          as: "variant",
        },
      },
      { $unwind: "$variant" },

      {
        $lookup: {
          from: "products",
          localField: "variant._id",
          foreignField: "variants",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "categories",
          localField: "category.parentId",
          foreignField: "_id",
          as: "parent",
        },
      },
      { $unwind: { path: "$parent", preserveNullAndEmptyArrays: true } },

      ...(type ? [{ $match: { "parent.slug": type } }] : []),

      {
        $group: {
          _id: "$product._id",
          productData: { $first: "$product" },
          totalQuantity: { $sum: "$totalQuantityPerVariant" },
        },
      },

      { $sort: { totalQuantity: -1 } },
      { $limit: n },

      {
        $lookup: {
          from: "variants",
          localField: "productData.variants",
          foreignField: "_id",
          as: "variants",
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "productData.categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },

      {
        $project: {
          _id: "$productData._id",
          name: "$productData.name",
          slug: "$productData.slug",
          description: "$productData.description",
          images: "$productData.images",
          price: "$productData.price",
          variants: 1,
          categoryId: { $arrayElemAt: ["$categories", 0] },
          totalQuantity: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getLimitProductsByCategorySlug = (limit, slug) => {
  const limitNumber = Number(limit);
  const res = ProductModel.aggregate([
    { $unwind: "$categoryId" },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryId",
      },
    },
    { $unwind: "$categoryId" },
    {
      $match: {
        "categoryId.slug": slug,
      },
    },

    {
      $lookup: {
        from: "variants",
        localField: "variants",
        foreignField: "_id",
        as: "variants",
      },
    },
    { $limit: limitNumber }, // giới hạn kết quả
  ]);

  return res;
};

const getProductsByTerm = async (terms = []) => {
  try {
    const regexConditions = terms.map((t) => ({
      $or: [
        { name: { $regex: t, $options: "i" } },
        { "categories.name": { $regex: t, $options: "i" } },
      ],
    }));

    const res = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      {
        $match: {
          $or: regexConditions.flat(),
        },
      },
      {
        $lookup: {
          from: "variants",
          localField: "variants",
          foreignField: "_id",
          as: "variants",
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
      // {
      //   collation: { locale: "vi", strength: 1 },
      // },
    ]);

    return res;
  } catch (error) {
    return [];
  }
};

export {
  addOneProduct,
  deleteOneProduct,
  getAllProductWithVariantStock,
  deleteManyProduct,
  getProductBySlug,
  getProductQuantity,
  fetchProducts,
  getAllBrandNames,
  getAllProductDashboard,
  getTopNBestSellingProducts,
  getTopNNewProducts,
  getLimitProductsByCategorySlug,
  getProductsByTerm,
};
