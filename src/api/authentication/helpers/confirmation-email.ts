import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL;
const pass = process.env.PASSWORD;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export function sendConfirmationEmail(
  name: string,
  email: string,
  otp: number
) {
  transport.sendMail({
    from: user,
    to: email,
    subject: "Verify your email",
    html: `
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up.</p>
        <p>Your OTP is <strong>${otp}</strong></p>
        `,
  });
}
