import evaluationModel from "../models/evaluation.model.js";
import mongoose from "mongoose";

const getEvaluationsByProductId = async (productId) => {
  try {
    const productObjId = new mongoose.Types.ObjectId(`${productId}`);
    const res = await evaluationModel.aggregate([
      {
        $match: {
          productId: productObjId,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$productId",
          evaluations: { $push: "$$ROOT" },
          avgStar: { $avg: "$rating" },
        },
      },
    ]);

    return res[0];
  } catch (error) {
    throw error;
  }
};

const addEvaluationComment = async (userName, comment, productId) => {
  const objectProductId = new mongoose.Types.ObjectId(`${productId}`);
  try {
    const result = await evaluationModel.create({
      userName,
      comment,
      productId: objectProductId,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const addEvaluationRating = async (userName, rating, productId) => {
  const objectProductId = new mongoose.Types.ObjectId(`${productId}`);
  try {
    const isExist = await evaluationModel.findOne({
      userName,
      objectProductId,
    });

    let result;

    if (!isExist) {
      result = await evaluationModel.create({
        userName,
        rating,
        productId: objectProductId,
      });
    } else {
      isExist.rating = rating;
      isExist.save();
      result = isExist;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export { getEvaluationsByProductId, addEvaluationComment, addEvaluationRating };
