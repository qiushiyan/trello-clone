import type { Document } from "mongoose";
import { User } from "@trello-clone/types";

export interface UserDocument extends User, Document {
  validatePassword(password: string): Promise<boolean>;
}

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}
