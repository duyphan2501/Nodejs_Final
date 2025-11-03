import express from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart)
cartRouter.get("/get/:userId", getCart)
cartRouter.delete("/delete", removeFromCart)
cartRouter.put("/update", updateCart)

export default cartRouter;
