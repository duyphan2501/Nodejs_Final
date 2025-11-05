import express from "express";
import checkAuth from "../middlewares/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/create", checkAuth, createAddress);
addressRouter.get("/all", checkAuth, getAllAddresses);
addressRouter.delete("/delete/:id", checkAuth, deleteAddress);
addressRouter.put("/update", checkAuth, updateAddress);

export default addressRouter;
