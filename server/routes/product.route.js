import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductBySlugController,
  getProductStats,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  productSchema,
  updateProductSchema,
} from "../helpers/productValidate.helper.js";
import validate from "../middlewares/joiValidate.middleware.js";
import { uploadAnyFiles } from "../middlewares/multer.middleware.js";
import checkAuth from "../middlewares/auth.middleware.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  checkAuth,
  uploadAnyFiles,
  validate(productSchema),
  addProduct
);
productRouter.put(
  "/:_id",
  uploadAnyFiles,
  validate(updateProductSchema),
  updateProduct
);
productRouter.get("/", getProduct);
productRouter.delete("/delete", deleteProduct);
productRouter.get("/:slug", getProductBySlugController);

//Route thống kê

//Lấy số lượng sản phẩm trong từng danh mục route
productRouter.get("/statistic/parent-category", checkAuth, getProductStats);

export default productRouter;
