import createHttpError from "http-errors";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

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

export {
  addOneProduct,
  deleteOneProduct,
  getAllProductWithVariantStock,
  deleteManyProduct,
  getProductBySlug,
  getProductQuantity,
};
