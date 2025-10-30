import express from "express";
import {
  changePassword,
  forgotPassword,
  googleLogin,
  login,
  logout,
  recoveryPassword,
  refreshToken,
  signUp,
  updateUserDetail,
  verifyAccount,
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.get("/verify/:token", verifyAccount);
userRouter.post("/login", login);
userRouter.post("/login/google", googleLogin);
userRouter.delete("/logout", checkAuth, logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.put("/recovery-password", recoveryPassword);
userRouter.put("/change-password", checkAuth, changePassword);
userRouter.put("/profile/update", checkAuth, updateUserDetail);
userRouter.put("/refresh-token", refreshToken);

export default userRouter;
