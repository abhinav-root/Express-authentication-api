import { Router } from "express";
import { body } from "express-validator";
import { sendValidationErrors } from "../../../utils/validation-errors";
import { checkUserWithExistingEmail } from "../middlewares/check-existing-user-with-email.middleware";
import {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  savePassword,
} from "../services/auth.service";

const authRouter = Router();

// Sign In
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

// Sign Up
authRouter.post(
  "/signup",
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("firstName cannot be empty")
    .isLength({ min: 2 })
    .withMessage("firstName cannot be shorter than 2 characters")
    .isLength({ max: 30 })
    .withMessage("firstName cannot exceed 30 characters")
    .toLowerCase(),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("lastName cannot be empty")
    .isLength({ min: 2 })
    .withMessage("lastName cannot be shorter than 2 characters")
    .isLength({ max: 30 })
    .withMessage("lastName cannot exceed 30 characters")
    .toLowerCase(),
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
  checkUserWithExistingEmail,
  signUp
);

// Forgt password
authRouter.post(
  "/forgot-password",
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  sendValidationErrors,
  forgotPassword
);

authRouter.get("/reset-password/:id/:token", resetPassword);

authRouter.post("/reset-password/:id/:token", savePassword);

export default authRouter;
