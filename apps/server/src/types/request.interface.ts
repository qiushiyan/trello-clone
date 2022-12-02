import type { Request, Response, NextFunction } from "express";
import { UserDocument } from "./user.interface";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface EmailExistsInput {
  email: string;
}

export interface CreateBoardInput {
  title: string;
  description?: string;
}

export type LoginRequest = Request<any, any, LoginInput, any>;
export type RegisterRequest = Request<any, any, RegisterInput, any>;
export type EmailExistsRequest = Request<any, any, EmailExistsInput, any>;
export type CreateBoardRequest = Request<any, any, CreateBoardInput, any> & {
  user?: UserDocument;
};
export interface ExpressRequest extends Request {
  user?: UserDocument;
}