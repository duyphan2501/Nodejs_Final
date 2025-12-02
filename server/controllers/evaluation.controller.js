import {
  getEvaluationsByProductId,
  addEvaluationComment,
} from "../services/evaluation.service.js";

const getEvaluationController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await getEvaluationsByProductId(productId);
    return res.status(200).json({
      success: true,
      evaluations: result?.evaluations.length > 0 ? result.evaluations : [],
      averageStar: result?.evaluations.length > 0 ? result.avgStar : 0,
    });
  } catch (error) {
    next(error);
  }
};

const addEvaluationController = async (req, res, next) => {
  try {
    const { userName, rating, comment, productId } = req.body;

    // io.emit("newComment", {
    //   userName,
    //   rating,
    //   comment,
    //   productId,
    //   createdAt: new Date().toISOString(),
    // });

    const result = await addEvaluation(userName, rating, comment, productId);
    return res.status(200).json({
      success: true,
      evaluation: result,
    });
  } catch (error) {
    next(error);
  }
};

export { getEvaluationController, addEvaluationController };
