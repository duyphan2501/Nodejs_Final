import express from "express";
import {
  getEvaluationController,
  addEvaluationController,
} from "../controllers/evaluation.controller.js";

const evaluationRouter = express.Router();

evaluationRouter.get("/product/:productId", getEvaluationController);
evaluationRouter.post("/", addEvaluationController);

export default evaluationRouter;
