import mongoose from "mongoose";
import { getUTCTimestamp } from "../helpers/util";
const AccountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    otpExpiryTime: { type: Number, default: getUTCTimestamp() + 60 * 60 },
  },
  { collection: "accounts", timestamps: true }
);

export default mongoose.model("Account", AccountSchema);
