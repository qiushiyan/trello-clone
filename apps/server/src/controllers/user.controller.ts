import type { Response, NextFunction } from "express";
import User from "../models/user.schema";
import { Error as MongooseError } from "mongoose";
import { UserDocument } from "../types/user.interface";
import jwt from "jsonwebtoken";
import {
  EmailExistsInput,
  EmailExistsRequest,
  ExpressRequest,
  LoginRequest,
  RegisterInput,
  RegisterRequest,
} from "../types/request.interface";

const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET!
  );
  return {
    email: user.email,
    username: user.username,
    id: user._id,
    token,
  };
};

export const currentUser = async (req: ExpressRequest, res: Response) => {
  if (req.user) {
    return res.json(normalizeUser(req.user));
  } else {
    return res.status(401).json({ message: "login to see the current user" });
  }
};

export const login = async (
  req: LoginRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(422).json({ message: "Email does not exist" });
  }

  if (await user.validatePassword(password)) {
    return res.send(normalizeUser(user));
  } else {
    return res.status(422).json({ message: "Wrong password" });
  }
};

export const emailExists = async (
  req: EmailExistsRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  return res.json({ exists: !!user });
};

export const register = async (
  req: RegisterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({
      email,
      username,
      password,
    });
    const userDoc = await user.save();
    return res.status(201).json(normalizeUser(userDoc));
  } catch (err: any) {
    if (err instanceof MongooseError.ValidationError) {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join("\n ");
      return res.status(422).json({ message });
    }
    // special case foro non-unique error
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(422).json({ message: "Email is already registered" });
    }

    return res
      .status(400)
      .json({ message: "Iynternal server error, try again later" });
  }
};
