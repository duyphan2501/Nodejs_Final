import CreateError from "http-errors";
import { checkExistingUser, createNewUser, hashPassword } from "../services/user.service.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { filterFieldUser } from "../helpers/filterField.js";

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password)
      throw CreateError.BadRequest("Please fill in all fields!");

    // check user exist
    const isExistingUser = await checkExistingUser(email)
    if (isExistingUser) throw CreateError.Conflict("Email is already registerd")
    
    // hashPassword
    const hashedPassword = await hashPassword(password)

    // create new user in db
    const newUser = await createNewUser(name, email, hashedPassword)
    
    // send varification email
    const verificationToken = await sendVerificationEmail(name, email)

    // update verification token in db
    const verificationTokenExpireAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    newUser.verificationToken = verificationToken
    newUser.verificationTokenExpireAt = verificationTokenExpireAt
    await newUser.save()

    return res.status(201).json({
      message: "Sign up sucessfully",
      newUser: filterFieldUser(newUser),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {signUp}
