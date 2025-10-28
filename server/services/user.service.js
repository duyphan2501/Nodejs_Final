import { sendForgotPasswordEmail, sendVerificationEmail } from "../helpers/email.helper.js";
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
    verificationToken,
  });
};

const sendVerificationEmailtoUser = async (user) => {
  // send varification email
  const verificationToken = await sendVerificationEmail(user.name, user.email);

  // update verification token in db
  const verificationTokenExpireAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  user.verificationToken = verificationToken;
  user.verificationTokenExpireAt = verificationTokenExpireAt;
  await user.save();
};

const sendForgotPasswordEmailtoUser = async (user) => {
  const otp = await sendForgotPasswordEmail(user.name, user.email);

  const forgotPasswordTokenExpireAt = new Date(Date.now() + 1000 * 60 * 5);
  user.forgotPasswordTokenExpireAt = forgotPasswordTokenExpireAt;
  user.forgotPasswordToken = otp;
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

export {
  getUserByEmail,
  hashPassword,
  createNewUser,
  getUnverifiedUser,
  sendVerificationEmailtoUser,
  sendForgotPasswordEmailtoUser,
  getForgotPasswordUser,
  checkPassword,
};
