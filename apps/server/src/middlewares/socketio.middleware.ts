import { SocketIOSocket } from "@trello-clone/types";
import { UserPayload } from "../types/user.interface";
import jwt from "jsonwebtoken";
import User from "../models/user.schema";
import { normalizeUser } from "../controllers/user.controller";
export default async (socket: SocketIOSocket, next: Function) => {
  try {
    const token = (socket.handshake.auth.token as string) || "";
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const user = await User.findById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }
    socket.data.user = normalizeUser(user);
    next();
  } catch {
    next(new Error("socket.io Authentication error"));
  }
};
