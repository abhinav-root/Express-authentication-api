import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendConfirmationEmail } from "../helpers/confirmation-email";
import { getOtp } from "../helpers/otp";
import { getUTCTimestamp } from "../helpers/util";
import AccountModel from "../models/Account.model";
import User from "../models/User.model";

export async function sendOtp(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "No user registered with this email" });
  }

  const otp = getOtp();
  await saveOtp(email, otp);
  const fullName = user.firstName + " " + user.lastName;
  sendConfirmationEmail(fullName, email, otp);

  return res.status(200).json({ message: "OTP sent" });
}

export async function saveOtp(email: string, otp: number) {
  console.log({ email, otp });
  const account = await AccountModel.findOneAndUpdate(
    { email },
    { email, otp, otpExpiryTime: getUTCTimestamp() + 20 },
    { new: true, upsert: true }
  );
}

export async function verifyOtp(req: Request, res: Response) {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  const account: any = await AccountModel.findOne({ email });
  if (!account) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "No user found with given email" });
  }

  const otpMatch = otp == account.otp;

  if (!otpMatch) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Incorrect OTP" });
  }

  const now = getUTCTimestamp();
  const otpExpiryTime = account.otpExpiryTime;
  const isOtpExpired = now > otpExpiryTime;
  console.log({ otpExpiryTime, now, diff: now - otpExpiryTime });

  if (isOtpExpired) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "OTP Expired" });
  }

  await user?.updateOne({ $set: { verifiedAccount: true } });

  return res.json({ msg: "OTP matched" });
}
