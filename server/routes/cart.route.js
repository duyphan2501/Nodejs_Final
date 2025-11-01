import express from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart)
cartRouter.get("/get/:userId", getCart)

export default cartRouter;
