import { Router } from "express";
import { body } from "express-validator";
import { sendValidationErrors } from "../../../common/validation-errors";
import { signIn } from "../services/auth.service";

const authRouter = Router();

authRouter.post(
  "/signin",
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 15 })
    .withMessage("Password cannot exceed 15 characters"),
  sendValidationErrors,
  signIn
);

export default authRouter;
