import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart)
cartRouter.get("/get/:userId", getCart)
cartRouter.delete("/delete", removeFromCart)

export default cartRouter;
