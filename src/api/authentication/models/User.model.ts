import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: mongoose.SchemaTypes.String,
      lowercase: true,
      trim: true,
      required: true,
    },
    lastName: {
      type: mongoose.SchemaTypes.String,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      trim: true,
      required: true,
    },
    verifiedAccount: { type: mongoose.SchemaTypes.Boolean, default: false },
  },
  {
    collection: "users",
    timestamps: true,
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
      },
    },
  }
);

export default mongoose.model("User", UserSchema);
