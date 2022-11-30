import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Invalid email format"],
      unique: true,
      index: true,
    },
    username: { type: String, required: [true, "Username is required"] },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<UserDocument>("User", userSchema);
