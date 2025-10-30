import CreateError from "http-errors";
import {
  getUserByEmail,
  checkPassword,
  createNewUser,
  getUnverifiedUser,
  hashPassword,
  sendVerificationEmailtoUser,
  sendForgotPasswordEmailtoUser,
  getForgotPasswordUser,
} from "../services/user.service.js";
import { filterFieldUser } from "../helpers/filterField.js";
import UserModel from "../models/user.model.js";
import {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
  verifyRefreshToken,
} from "../helpers/jwt.helper.js";

const signUp = async (req, res, next) => {
  try {
    const { email, fullname } = req.body;

    if (!email) throw CreateError.BadRequest("Vui lòng nhập email!");

    // check user exist
    const isExistingUser = await getUserByEmail(email);
    if (isExistingUser) {
      if (isExistingUser.isVerified)
        throw CreateError.Conflict("Email đã được sử dụng!");
      return res.status(401).json({
        message:
          "Email đã được đăng ký nhưng chưa xác minh! Vui lòng kiểm tra email để xác minh tài khoản.",
        user: filterFieldUser(isExistingUser),
        success: false,
      });
    }

    if (!fullname) throw CreateError.BadRequest("Vui lòng nhập họ tên!");

    // create new user in db
    const user = await createNewUser(fullname, email, "default");

    // send verification email
    await sendVerificationEmailtoUser(user);

    return res.status(201).json({
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.",
      user: filterFieldUser(user),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const { verificationToken, password, confirmPassword } = req.body;
    if (!verificationToken)
      throw CreateError.BadRequest("Vui lòng cung cấp mã xác minh");

    const foundUser = await getUnverifiedUser(verificationToken);

    if (!foundUser) throw CreateError.NotFound("Mã xác minh không hợp lệ");

    if (foundUser.verificationTokenExpireAt < new Date()) {
      // resend verification email
      await sendVerificationEmailtoUser(foundUser);
      throw CreateError.BadRequest(
        "Mã xác minh đã hết hạn! Chúng tôi đã gửi một email xác minh mới cho bạn."
      );
    }

    if (!password || !confirmPassword)
      throw CreateError.BadRequest(
        "Vui lòng nhập mật khẩu và xác nhận mật khẩu"
      );
    if (password !== confirmPassword)
      throw CreateError.BadRequest("Mật khẩu và xác nhận mật khẩu không khớp");
    const hashedPassword = await hashPassword(password);
    foundUser.password = hashedPassword;
    foundUser.isVerified = true;
    foundUser.verificationToken = undefined;
    foundUser.verificationTokenExpireAt = undefined;
    await foundUser.save();

    return res.status(200).json({
      message: "Xác thực tài khoản thành công!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email )
      throw CreateError.BadRequest("Vui lòng điền email!");

    const foundUser = await getUserByEmail(email);

    if (!foundUser) throw CreateError.NotFound("Tài khoản không tồn tại");
    if (!foundUser.isVerified) {
      return res.status(401).json({
        message:
          "Tài khoản chưa được xác minh! Vui lòng kiểm tra email để xác minh tài khoản.",
        user: filterFieldUser(foundUser),
        success: false,
      });
    }

    if (!password)
      throw CreateError.BadRequest("Vui lòng điền mật khẩu!");

    const isCorrectPassword = await checkPassword(password, foundUser.password);
    if (!isCorrectPassword)
      throw CreateError.Unauthorized("Mật khẩu không đúng");

    if (!foundUser.isVerified)
      throw CreateError.Forbidden("Vui lòng xác minh tài khoản của bạn!");

    // generate token and set cookie
    const accessToken = await generateAccessTokenAndSetCookie(
      res,
      foundUser._id
    );
    const refreshToken = await generateRefreshTokenAndSetCookie(
      res,
      foundUser._id
    );

    // save token in db
    foundUser.refreshToken = refreshToken;
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    foundUser.refreshTokenExpireAt = expireDate;
    foundUser.lastLogin = Date.now();
    await foundUser.save();

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      success: true,
      user: filterFieldUser(foundUser),
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: undefined,
      refreshTokenExpireAt: undefined,
    });
    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw CreateError.BadRequest("Please provide email!");

    const foundUser = await getUserByEmail(email);

    if (!foundUser) throw CreateError.NotFound("User does not exist");

    await sendForgotPasswordEmailtoUser(foundUser);

    return res.status(200).json({
      message: `Recovery password email sent to ${email}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const recoveryPassword = async (req, res, next) => {
  try {
    const { email, otpCode, password, confirmPassword } = req.body;

    // check missing fields
    if (!email || !password || !confirmPassword) {
      throw CreateError.BadRequest(
        "Email, password and confirm password are required"
      );
    }

    if (!otpCode) throw CreateError.BadRequest("OTP code is missing");

    const foundUser = await getUserByEmail(email);
    if (!foundUser) throw CreateError.NotFound("User does not exist");

    // check otp
    if (foundUser.forgotPasswordToken !== otpCode) {
      throw CreateError.BadRequest("OTP is not correct");
    }

    // check expire
    if (foundUser.forgotPasswordTokenExpireAt < new Date()) {
      await sendForgotPasswordEmailtoUser(foundUser);
      throw CreateError.BadRequest(
        "OTP expired! We sent a new recovery password email to you"
      );
    }

    // check confirm password
    if (password !== confirmPassword) {
      throw CreateError.BadRequest(
        "Password and confirm password do not match"
      );
    }

    // hash and update new password
    const hashedPassword = await hashPassword(password);
    foundUser.password = hashedPassword;

    // clear otp info
    foundUser.forgotPasswordToken = undefined;
    foundUser.forgotPasswordTokenExpireAt = undefined;

    await foundUser.save();

    return res.status(200).json({
      message: "Password reset successfully!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserDetail = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw CreateError.Unauthorized("You have to login first");

    const { name, phone } = req.body;

    if (!name || !phone)
      throw CreateError.BadRequest("Name and phone are required");

    const user = await UserModel.findById(userId);

    if (!user) throw CreateError.NotFound("User does not exist");

    if (name !== user.name) user.name = name;
    if (phone !== user.phone) user.phone = phone;

    await user.save();
    return res.status(200).json({
      user: filterFieldUser(user),
      message: "Update user detail successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) throw CreateError.Unauthorized("You have to login first");

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword)
      throw CreateError.BadRequest("Please fill in all password!");

    if (newPassword !== confirmPassword)
      throw CreateError.BadRequest(
        "New password and confirm password do not match!"
      );

    const user = await UserModel.findById(userId);

    if (!user) throw CreateError.NotFound("User does not exist");

    const isCorrectPassword = await checkPassword(
      currentPassword,
      user.password
    );

    if (!isCorrectPassword)
      throw CreateError.Forbidden("Password is not correct");

    const hashedNewPassword = await hashPassword(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      message: "Changed password successfully",
      success: false,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw CreateError.BadRequest("Refresh token is missing");

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    // Kiểm tra token còn hạn trong DB
    const user = await UserModel.findOne({
      _id: userId,
      refreshToken,
      refreshTokenExpireAt: { $gt: new Date() },
    });

    if (!user)
      throw CreateError.Unauthorized("Invalid or expired refresh token");

    // generate new token
    const accessToken = await generateAccessTokenAndSetCookie(res, user._id);
    const newRefreshToken = await generateRefreshTokenAndSetCookie(
      res,
      user._id
    );

    // save token in db
    user.refreshToken = newRefreshToken;
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokenExpireAt = expireDate;
    await user.save();

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
      user: sanitizeUser(user),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw CreateError.BadRequest("Vui lòng cung cấp email!");

    const foundUser = await getUserByEmail(email);
    if (!foundUser) throw CreateError.NotFound("Tài khoản không tồn tại");
    if (foundUser.isVerified)
      throw CreateError.BadRequest("Tài khoản đã được xác minh!");
    await sendVerificationEmailtoUser(foundUser);

    return res.status(200).json({
      message: `Email xác nhận đã gửi đến ${email}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  signUp,
  verifyAccount,
  login,
  logout,
  forgotPassword,
  recoveryPassword,
  changePassword,
  updateUserDetail,
  refreshToken,
  sendVerificationEmail,
};
