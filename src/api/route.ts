import { Router } from "express";
import authRouter from "./authentication/controllers/auth.controller";
import otpRouter from "./authentication/controllers/otp.controller";

const router = Router();

router.use("/accounts", authRouter);
router.use("/otp", otpRouter);

export default router;
