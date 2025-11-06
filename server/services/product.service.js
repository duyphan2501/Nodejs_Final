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

export {
  addOneProduct,
  deleteOneProduct,
  getAllProductWithVariantStock,
  deleteManyProduct,
};
