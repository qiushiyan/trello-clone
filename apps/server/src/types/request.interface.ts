import type { Request } from "express";
import {
  CreateBoardInput,
  LoginInput,
  RegisterInput,
  EmailExistsInput,
  CurrentUser,
} from "@trello-clone/types";

export interface ExpressRequest extends Request {
  user?: CurrentUser;
}

export type LoginRequest = Request<any, any, LoginInput, any>;
export type RegisterRequest = Request<any, any, RegisterInput, any>;
export type EmailExistsRequest = Request<any, any, EmailExistsInput, any>;
export type CreateBoardRequest = Request<any, any, CreateBoardInput, any> & {
  user?: CurrentUser;
};
export type GetBoardRequest = Request<{ id: string }, any, any, any> & {
  user?: CurrentUser;
};

export type GetColumnRequest = Request<{ id: string }, any, any, any> & {
  user?: CurrentUser;
};
