import { Router } from "express";
import { body } from "express-validator";
import { sendValidationErrors } from "../../../utils/validation-errors";
import { sendOtp, verifyOtp } from "../services/otp.service";

const otpRouter = Router();

otpRouter.post(
  "/send",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  sendValidationErrors,
  sendOtp
);

otpRouter.post(
  "/verify",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  body("otp").notEmpty().withMessage("OTP cannot be empty"),
  sendValidationErrors,
  verifyOtp
);

export default otpRouter;
