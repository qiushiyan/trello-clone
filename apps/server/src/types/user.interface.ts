import type { Document } from "mongoose";

export interface User {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface UserDocument extends User, Document {
  validatePassword(password: string): Promise<boolean>;
}

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}
