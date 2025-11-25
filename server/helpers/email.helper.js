import transporter from "../config/email.config.js";
import forgotPasswordEmail from "../templates/forgotPassword.template.js";
import orderConfirmationEmail from "../templates/orderConfirm.template.js";
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

const sendVerificationEmail = async (name, email, hours) => {
  const otpCode = Math.floor(Math.random() * 900000 + 100000);
  const { subject, html } = verificationEmail(name, otpCode, hours);
  await sendEmail(email, subject, html);
  return otpCode;
};

const sendForgotPasswordEmail = async (name, email, minutes) => {
  const token = crypto.randomBytes(32).toString("hex");
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const { subject, html } = forgotPasswordEmail(name, resetLink, minutes);
  await sendEmail(email, subject, html);
  return token;
};

const sendOrderConfirmEmail = async (order) => {
  const { subject, html } = orderConfirmationEmail(
    order.orderId,
    order.items,
    order.orderAmount,
    order.shippingInfo,
    order.payment.provider
  );
  await sendEmail(order.email, subject, html)
};

export {
  sendEmail,
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendOrderConfirmEmail,
};
