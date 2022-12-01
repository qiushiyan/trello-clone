import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/user.interface";
import User from "../models/user.schema";
import { ExpressRequest } from "../types/request.interface";
export default async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Login to view this page");
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const user = await User.findById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
};
