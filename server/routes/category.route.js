import express from "express";
import {
  getShoeCategory,
  getSandalCategory,
  getBackpackCategory,
  deleteCategory,
  editCategory,
  addCategory,
  getListCategories,
  getCategoryFromSlug,
} from "../controllers/category.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { getCategoryBySlug } from "../services/category.service.js";

const categoryRouter = express.Router();

categoryRouter.post("/", uploadSingleImage, addCategory);
categoryRouter.get("/trans/:slug", getCategoryFromSlug);
categoryRouter.get("/shoe", checkAuth, getShoeCategory);
categoryRouter.get("/sandal", checkAuth, getSandalCategory);
categoryRouter.get("/backpack", checkAuth, getBackpackCategory);
categoryRouter.get("/backpack", checkAuth, getBackpackCategory);
categoryRouter.get("/list", getListCategories);
categoryRouter.delete("/delete", checkAuth, deleteCategory);
categoryRouter.put("/:id", checkAuth, editCategory);

export default categoryRouter;
