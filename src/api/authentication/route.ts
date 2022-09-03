import { Router } from "express";
import authRouter from "./controllers/auth.controller";

const router = Router();

router.use("/auth", authRouter);

export default router;
