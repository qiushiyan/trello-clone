import type { Request } from "express";
import {
  CreateBoardInput,
  LoginInput,
  RegisterInput,
  EmailExistsInput,
  CurrentUser,
  CreateTaskInput,
  GetBoardInput,
  GetColumnInput,
  GetTasksInput,
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
export type GetBoardRequest = Request<GetBoardInput, any, any, any> & {
  user?: CurrentUser;
};

export type GetColumnRequest = Request<GetColumnInput, any, any, any> & {
  user?: CurrentUser;
};

export type CreateTaskRequest = Request<any, any, CreateTaskInput, any> & {
  user?: CurrentUser;
};

export type GetTasksRequest = Request<GetTasksInput, any, any, any> & {
  user?: CurrentUser;
};
