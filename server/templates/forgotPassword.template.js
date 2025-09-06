const otpForgotPasswordEmail = (name, otp, expireMinutes) => {
  return {
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <div style="background: #e74c3c; color: white; padding: 15px; text-align: center; font-size: 20px;">
            Password Reset Request 🔑
          </div>
          <div style="padding: 20px;">
            <p>Hi <b>${name}</b>,</p>
            <p>You requested to reset your password. Please use the OTP below to continue:</p>
            <h1 style="letter-spacing: 4px; color:#e74c3c; text-align:center;">${otp}</h1>
            <p>This OTP will expire in <strong>${expireMinutes} minutes</strong>. Do not share it with anyone.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Our App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };
};

export default otpForgotPasswordEmail;
