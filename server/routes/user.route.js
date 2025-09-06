import express from "express";
import { forgotPassword, login, logout, recoveryPassword, signUp, verifyAccount } from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.get("/verify/:token", verifyAccount);
userRouter.post("/login", login);
userRouter.delete("/logout", checkAuth, logout);
userRouter.post("/forgot-password", forgotPassword)
userRouter.put("/recovery-password", recoveryPassword)

export default userRouter;
