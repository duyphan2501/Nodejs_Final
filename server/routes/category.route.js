import express from "express";
import {
  getShoeCategory,
  getSandalCategory,
  getBackpackCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/shoe", checkAuth, getShoeCategory);
categoryRouter.get("/sandal", checkAuth, getSandalCategory);
categoryRouter.get("/backpack", checkAuth, getBackpackCategory);
categoryRouter.get("/backpack", checkAuth, getBackpackCategory);
categoryRouter.delete("/delete", deleteCategory);
export default categoryRouter;
