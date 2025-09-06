const verificationEmail = (name, verificationLink) => {
  return {
    subject: "Verify your account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <div style="background: #4CAF50; color: white; padding: 15px; text-align: center; font-size: 20px;">
            Welcome to Our App 🚀
          </div>
          <div style="padding: 20px;">
            <p>Hi <b>${name}</b>,</p>
            <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationLink}" 
                 style="background: #4CAF50; color: white; padding: 12px 20px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </p>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>If you did not create an account, please ignore this email.</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} Our App. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };
};

export default verificationEmail