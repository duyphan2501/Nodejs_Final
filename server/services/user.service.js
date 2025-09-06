import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

const checkExistingUser = async (email) => {
  const user = await UserModel.findOne({
    email,
    $or: [
      { verificationTokenExpireAt: { $gt: new Date() } },
      { verificationTokenExpireAt: { $exists: false } },
    ],
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

export { checkExistingUser, hashPassword, createNewUser };
