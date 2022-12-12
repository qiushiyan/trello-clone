import { Server, Socket } from "socket.io";
import {
  Board,
  DeleteBoardInput,
  UpdateBoardInput,
  BoardsJoinInput,
  BoardsLeaveInput,
} from "./board";
import {
  Column,
  CreateColumnInput,
  DeleteColumnInput,
  UpdateColumnInput,
} from "./column";
import {
  CreateTaskInput,
  DeleteTaskInput,
  Task,
  UpdateTaskInput,
} from "./task";
import { CurrentUser } from "./user";

export const enum ClientEvents {
  BoardsJoin = "boards:join",
  BoardsLeave = "boards:leave",
  BoardsUpdate = "boards:update",
  BoardsDelete = "boards:delete",

  ColumnsCreate = "columns:create",
  ColumnsUpdate = "columns:update",
  ColumnsDelete = "columns:delete",

  TasksCreate = "tasks:create",
  TasksUpdate = "tasks:update",
  TasksDelete = "tasks:delete",
}

export const enum ServerEvents {
  ColumnCreateSuccess = "columns:createSuccess",
  ColumnCreateFailure = "columns:createFailure",
  ColumnsUpdateSuccess = "columns:updateSuccess",
  ColumnsUpdateFailure = "columns:updateFailure",
  ColumnsDeleteSuccess = "columns:deleteSuccess",
  ColumnsDeleteFailure = "columns:deleteFailure",

  TasksCreateSuccess = "tasks:createSuccess",
  TasksCreateFailure = "tasks:createFailure",
  TasksUpdateSuccess = "tasks:updateSuccess",
  TasksUpdateFailure = "tasks:updateFailure",
  TasksDeleteSuccess = "tasks:deleteSuccess",
  TasksDeleteFailure = "tasks:deleteFailure",

  BoardsUpdateSuccess = "boards:updateSuccess",
  BoardsUpdateFailure = "boards:updateFailure",
  BoardsDeleteSuccess = "boards:deleteSuccess",
  BoardsDeleteFailure = "boards:deleteFailure",
}

export interface ServerToClientEvents extends Record<ServerEvents, Function> {
  [ServerEvents.ColumnCreateSuccess]: (column: Column) => void;
  [ServerEvents.ColumnCreateFailure]: (msg: string) => void;
  [ServerEvents.ColumnsDeleteSuccess]: (column: Column) => void;
  [ServerEvents.ColumnsDeleteFailure]: (msg: string) => void;
  [ServerEvents.ColumnsUpdateSuccess]: (column: Column) => void;
  [ServerEvents.ColumnsUpdateFailure]: (msg: string) => void;

  [ServerEvents.TasksCreateSuccess]: (task: Task) => void;
  [ServerEvents.TasksCreateFailure]: (msg: string) => void;
  [ServerEvents.TasksDeleteSuccess]: (task: Task) => void;
  [ServerEvents.TasksDeleteFailure]: (msg: string) => void;
  [ServerEvents.TasksUpdateFailure]: (msg: string) => void;
  [ServerEvents.TasksUpdateSuccess]: (task: Task) => void;

  [ServerEvents.BoardsUpdateSuccess]: (board: Board) => void;
  [ServerEvents.BoardsUpdateFailure]: (msg: string) => void;
  [ServerEvents.BoardsDeleteSuccess]: () => void;
  [ServerEvents.BoardsDeleteFailure]: (msg: string) => void;
}

export interface ClientToServerEvents extends Record<ClientEvents, Function> {
  [ClientEvents.BoardsJoin]: (input: BoardsJoinInput) => void;
  [ClientEvents.BoardsLeave]: (input: BoardsLeaveInput) => void;
  [ClientEvents.BoardsUpdate]: (input: UpdateBoardInput) => void;
  [ClientEvents.BoardsDelete]: (input: DeleteBoardInput) => void;

  [ClientEvents.ColumnsCreate]: (input: CreateColumnInput) => void;
  [ClientEvents.ColumnsUpdate]: (input: UpdateColumnInput) => void;
  [ClientEvents.ColumnsDelete]: (input: DeleteColumnInput) => void;

  [ClientEvents.TasksCreate]: (input: CreateTaskInput) => void;
  [ClientEvents.TasksUpdate]: (input: UpdateTaskInput) => void;
  [ClientEvents.TasksDelete]: (input: DeleteTaskInput) => void;
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
