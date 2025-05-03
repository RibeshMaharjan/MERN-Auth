import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


// Looking to send emails in production? Check out our Email API/SMTP product!
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS
  }
});

export const sender = process.env.MAILTRAP_SENDER_EMAIL;


