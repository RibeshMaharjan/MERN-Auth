import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE
} from "./emailTemplates.js"
import { transporter, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (userEmail, verificationToken) => {
  try {
    // send mail with defined transport object
    const response = await transporter.sendMail({
      from: sender, // sender address
      to: userEmail, // list of receivers
      subject: "Verify your email", // Subject line
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // plain text body
      category: "Email Verification"
    });

    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification email: `, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
}

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: userEmail,
      subject: "Welcome Email",
      html: WELCOME_EMAIL_TEMPLATE
        .replace("[User's Name]", userName)
        .replace("[Your Company]", "Auth Practice")
        .replace("[Your Company Name]", "Auth Practice"),
      category: "Welcome"
    })
  } catch (error) {
    console.error(`Error sending welcome email: `, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
}
export const sendPasswordResetEmail = async (userEmail, resetUrl) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: userEmail,
      subject: "Password Reset",
      html: PASSWORD_RESET_REQUEST_TEMPLATE
        .replace("{resetURL}", resetUrl),
      category: "Password Reset"
    })
  } catch (error) {
    console.error(`Error sending welcome email: `, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
}
export const sendPasswordResetSuccessEmail = async (userEmail) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: userEmail,
      subject: "Password Reset Success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset success"
    })
  } catch (error) {
    console.error(`Error sending welcome email: `, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
}