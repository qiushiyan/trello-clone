import { Server, Socket } from "socket.io";
import { Column, CreateColumnInput } from "./column";
import { CreateTaskInput, Task } from "./task";
import { CurrentUser } from "./user";

export const enum ClientEvents {
  BoardsJoin = "boards:join",
  BoardsLeave = "boards:leave",
  ColumnsCreate = "columns:create",
  TasksCreate = "tasks:create",
}

export const enum ServerEvents {
  ColumnCreateSuccess = "columns:createSuccess",
  ColumnCreateFailure = "columns:createFailure",
  TasksCreateSuccess = "tasks:createSuccess",
  TasksCreateFailure = "tasks:createFailure",
}

export interface ServerToClientEvents extends Record<ServerEvents, Function> {
  [ServerEvents.ColumnCreateSuccess]: (column: Column) => void;
  [ServerEvents.ColumnCreateFailure]: (msg: string) => void;
  [ServerEvents.TasksCreateSuccess]: (task: Task) => void;
  [ServerEvents.TasksCreateFailure]: (msg: string) => void;
}

export interface BoardsJoinInput {
  boardId: string;
}

export interface BoardsLeaveInput {
  boardId: string;
}

export interface ClientToServerEvents extends Record<ClientEvents, Function> {
  [ClientEvents.BoardsJoin]: (input: BoardsJoinInput) => void;
  [ClientEvents.BoardsLeave]: (input: BoardsLeaveInput) => void;
  [ClientEvents.ColumnsCreate]: (input: CreateColumnInput) => void;
  [ClientEvents.TasksCreate]: (input: CreateTaskInput) => void;
}

interface SocketData {
  user?: CurrentUser;
}

export type SocketIOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  SocketData
>;

export type SocketIOSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  SocketData
>;
