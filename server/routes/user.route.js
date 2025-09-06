import express from "express";
import { signUp, verifyAccount } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.get("/verify/:token", verifyAccount);

export default userRouter;
