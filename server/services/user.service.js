import createHttpError from "http-errors";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../helpers/email.helper.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({
    email,
  });
  return user;
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

const createNewUser = async (name, email, password) => {
  const newUser = await UserModel.create({ name, email, password });
  if (!newUser) throw new Error("Failed to create new user");
  return newUser;
};

const getUnverifiedUser = async (verificationToken) => {
  return await UserModel.findOne({
    isVerified: false,
    verificationToken,
  });
};

const sendVerificationEmailtoUser = async (user) => {
  // send varification email
  const hours = 24;
  const verificationToken = await sendVerificationEmail(user.name, user.email, hours);
  const verificationTokenExpireAt = new Date(Date.now() + 1000 * 60 * 60 * hours);
  user.verificationToken = verificationToken;
  user.verificationTokenExpireAt = verificationTokenExpireAt;
  await user.save();
};

const sendForgotPasswordEmailtoUser = async (user) => {
  const minutes = 10
  const token = await sendForgotPasswordEmail(user.name, user.email, minutes);
  const forgotPasswordTokenExpireAt = new Date(Date.now() + 1000 * 60 * minutes);
  user.forgotPasswordTokenExpireAt = forgotPasswordTokenExpireAt;
  user.forgotPasswordToken = token;
  user.save();
};

const checkPassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const getForgotPasswordUser = async (email, forgotPasswordToken) => {
  return await UserModel.findOne({
    email,
    forgotPasswordToken,
  });
};

const usePurchasePoint = async (userId, point, session = null) => {
  if (point <= 0) {
    return; 
  }   

  const user = await UserModel.findById(userId).session(session);

  if (!user) {
    throw createHttpError(404, "Người dùng không tồn tại.");
  }

  if (user.purchasePoint < point) {
    throw createHttpError(400, `Điểm thưởng của bạn không đủ.`);
  }

  user.purchasePoint -= point;

  await user.save({ session });
  
  return user;
};



export {
  getUserByEmail,
  hashPassword,
  createNewUser,
  getUnverifiedUser,
  sendVerificationEmailtoUser,
  sendForgotPasswordEmailtoUser,
  getForgotPasswordUser,
  checkPassword,
  usePurchasePoint
};
