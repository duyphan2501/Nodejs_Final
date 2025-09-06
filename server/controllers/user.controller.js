import CreateError from "http-errors";
import {
  getUserByEmail,
  checkPassword,
  createNewUser,
  getUnverifiedUser,
  hashPassword,
  sendVerificationEmailtoUser,
} from "../services/user.service.js";
import { filterFieldUser } from "../helpers/filterField.js";

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      throw CreateError.BadRequest("Please fill in all fields!");

    // check user exist
    const isExistingUser = await getUserByEmail(email);
    if (isExistingUser)
      throw CreateError.Conflict("Email is already registerd");

    // hashPassword
    const hashedPassword = await hashPassword(password);

    // create new user in db
    const newUser = await createNewUser(name, email, hashedPassword);

    // send verification email
    await sendVerificationEmailtoUser(newUser);

    return res.status(201).json({
      message: "Sign up sucessfully",
      newUser: filterFieldUser(newUser),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const verificationToken = req.params.token;

    const foundUser = await getUnverifiedUser(verificationToken);

    if (!foundUser) throw CreateError.NotFound("User does not exist");

    if (foundUser.verificationTokenExpireAt < new Date()) {
      // resend verification email
      await sendVerificationEmailtoUser(foundUser);
      throw CreateError.BadRequest(
        "Link expired! We sent new verification email to you"
      );
    }

    foundUser.isVerified = true;
    foundUser.verificationToken = undefined;
    foundUser.verificationTokenExpireAt = undefined;
    await foundUser.save();

    const loginPageUrl = `${process.env.CLIENT_URL}/login`;
    return res.redirect(loginPageUrl);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw CreateError.BadRequest("Email or password is missing");

    const foundUser = await getUserByEmail(email);

    if (!foundUser) throw CreateError.NotFound("User does not exist");

    const isCorrectPassword = await checkPassword(password, foundUser.password);
    if (!isCorrectPassword)
      throw CreateError.Unauthorized("Password is not correct");

    // store session
    req.session.userId = foundUser._id;
    req.session.isAdmin = foundUser.isAdmin;

    return res.status(200).json({
      message: "Login sucessfully!",
      success: true,
      user: filterFieldUser(foundUser),
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

export { signUp, verifyAccount, login, logout };
