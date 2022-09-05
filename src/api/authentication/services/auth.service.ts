import { Request, Response } from "express";
import User from "../models/User.model";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { sendConfirmationEmail } from "../helpers/confirmation-email";
import { getOtp } from "../helpers/otp";
import { saveOtp } from "./otp.service";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";

const secret = process.env.JWT_SECRET!;

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid email or password" });
  }
  if (!user.verifiedAccount) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Please verify your account first" });
  }
  const passwordMatch = await bcrypt.compare(password, user?.password);

  if (!passwordMatch) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid email or password" });
  }
  const accessToken = jwt.sign({ userId: user.id, email: user.email }, secret, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accessToken,
  });
};

const signUp = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    const otp = getOtp();
    await saveOtp(email, otp);
    sendConfirmationEmail(user.fullName, email, otp);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "OTP sent. Please check your inbox" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "server error" });
  }
};

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ email, id: user.id }, secret, {
    expiresIn: "1h",
  });

  const resetLink = `http://localhost:${process.env.PORT}/api/accounts/reset-password/${user.id}/${token}`;

  return res.status(200).json({ resetLink });
}

async function resetPassword(req: Request, res: Response) {
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid link" });
    }
  }

  const isValidToken = jwt.verify(token, secret);

  if (!isValidToken) {
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid link" });
    }
  }

  res.render("reset-password.ejs");
}

async function savePassword(req: Request, res: Response) {
  const { id } = req.params;
  const { password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return res
      .send(StatusCodes.FORBIDDEN)
      .json({ error: "password and confirmPassword do not match" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.findByIdAndUpdate(id, { password: hashedPassword });
  return res.json({ message: "Password changed successfully" });
}

export { signIn, signUp, forgotPassword, resetPassword, savePassword };
