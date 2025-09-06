import express from "express";
import { login, signUp, verifyAccount } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.get("/verify/:token", verifyAccount);
userRouter.post("/login", login);

export default userRouter;
