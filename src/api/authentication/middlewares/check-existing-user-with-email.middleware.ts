import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.model";

export async function checkUserWithExistingEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ error: "This email is already registered" });
  }

  next();
}
