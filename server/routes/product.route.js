import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
} from "../controllers/product.controller.js";
import { productSchema } from "../helpers/productValidate.helper.js";
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
productRouter.get("/", getProduct);
productRouter.delete("/delete", deleteProduct);

export default productRouter;
