import type { Request } from "express";
import { UserDocument } from "./user.interface";
import {
  CreateBoardInput,
  LoginInput,
  RegisterInput,
  EmailExistsInput,
} from "@trello-clone/types";

export interface ExpressRequest extends Request {
  user?: UserDocument;
}

export type LoginRequest = Request<any, any, LoginInput, any>;
export type RegisterRequest = Request<any, any, RegisterInput, any>;
export type EmailExistsRequest = Request<any, any, EmailExistsInput, any>;
export type CreateBoardRequest = Request<any, any, CreateBoardInput, any> & {
  user?: UserDocument;
};
export type GetBoardRequest = Request<{ id: string }, any, any, any> & {
  user?: UserDocument;
};
