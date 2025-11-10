import express from "express";
import checkAuth from "../middlewares/auth.middleware.js";
import { getDailyVisits } from "../controllers/visit.controller.js";

const visitRouter = express.Router();

visitRouter.get("/", getDailyVisits);

export default visitRouter;
