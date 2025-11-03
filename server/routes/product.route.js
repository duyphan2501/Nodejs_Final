import express from "express";
import { addProduct } from "../controllers/product.controller.js";
import { productSchema } from "../helpers/productValidate.helper.js";
import validate from "../middlewares/joiValidate.middleware.js";
import { uploadAnyFiles } from "../middlewares/multer.middleware.js";

const productRouter = express.Router();

productRouter.post("/", uploadAnyFiles, validate(productSchema), addProduct);

export default productRouter;
