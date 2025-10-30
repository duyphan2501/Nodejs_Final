const verificationEmail = (name, otp, hours = 24) => {
  return {
    subject: "Verify Your Account - Our App",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #4CAF50; color: #ffffff; text-align: center; padding: 16px; font-size: 20px; font-weight: bold;">
            Account Verification 🔒
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <p>Hi <strong>${name}</strong>,</p>

            <p>Thank you for signing up for <strong>Our App</strong>! Please use the OTP below to verify your account:</p>

            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #4CAF50; color: #ffffff; font-size: 28px; font-weight: bold; padding: 15px 35px; border-radius: 8px; letter-spacing: 6px;">
                ${otp}
              </div>
            </div>

            <p>This OTP will expire in <strong>${hours} hours</strong>. Please enter it in the app to complete your verification.</p>

            <p>If you didn't create this account, please ignore this email.</p>

            <p style="margin-top: 25px;">Best regards,<br><strong>The Our App Team</strong></p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; text-align: center; padding: 12px; font-size: 12px; color: #666;">
            &copy; ${new Date().getFullYear()} Our App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };
};

export default verificationEmail;
