import CreateError from "http-errors";
import {
  checkExistingUser,
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
    const isExistingUser = await checkExistingUser(email);
    if (isExistingUser)
      throw CreateError.Conflict("Email is already registerd");

    // hashPassword
    const hashedPassword = await hashPassword(password);

    // create new user in db
    const newUser = await createNewUser(name, email, hashedPassword);

    // send verification email
    await sendVerificationEmailtoUser(newUser)

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
      await sendVerificationEmailtoUser(foundUser)
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

export { signUp, verifyAccount };
