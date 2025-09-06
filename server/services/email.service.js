import transporter from "../config/email.config.js";
import otpForgotPasswordEmail from "../templates/forgotPassword.template.js";
import verificationEmail from "../templates/verification.template.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const sendEmail = async (email, subject, html) => {
  const options = {
    from: `"Shoes Shop" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,
    html,
  };
  const info = await transporter.sendMail(options);
  console.log("Message sent:", info.messageId);
};

const sendVerificationEmail = async (name, email) => {
  const token = crypto.randomBytes(32).toString("hex");
  const verificationLink = `${process.env.BACKEND_URL}/api/v1/user/verify/${token}`;
  const { subject, html } = verificationEmail(name, verificationLink);
  await sendEmail(email, subject, html);
  return token;
};

const sendForgotPasswordEmail = async (name, email) => {
  const otpCode = Math.floor(Math.random() * 900000 + 100000);
  const {subject, html} = otpForgotPasswordEmail(name, otpCode, 5)
  await sendEmail(email, subject, html)
  return otpCode
};

export { sendEmail, sendVerificationEmail, sendForgotPasswordEmail };
