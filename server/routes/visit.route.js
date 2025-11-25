import express from "express";
import checkAuth from "../middlewares/auth.middleware.js";
import {
  getDailyVisits,
  recordVisit,
} from "../controllers/visit.controller.js";

const visitRouter = express.Router();

visitRouter.get("/", getDailyVisits);
visitRouter.post("/", recordVisit);

export default visitRouter;
