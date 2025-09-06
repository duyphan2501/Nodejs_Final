import express from "express";
import { signUp } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);

export default userRouter;
