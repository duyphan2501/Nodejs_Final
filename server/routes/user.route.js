import express from "express";
import { changePassword, forgotPassword, login, logout, recoveryPassword, refreshToken, sendVerificationEmail, signUp, updateUserDetail, verifyAccount } from "../controllers/user.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.put("/verify-account", verifyAccount);
userRouter.post("/login", login);
userRouter.delete("/logout", checkAuth, logout);
userRouter.post("/forgot-password", forgotPassword)
userRouter.put("/recovery-password", recoveryPassword)
userRouter.put("/change-password", checkAuth, changePassword)
userRouter.put("/profile/update", checkAuth, updateUserDetail)
userRouter.put("/refresh-token", checkAuth, refreshToken)
userRouter.put("/resend-verification-email", sendVerificationEmail);

export default userRouter;
