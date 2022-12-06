import { Server, Socket } from "socket.io";
import { Column } from "./column";
import { CurrentUser } from "./user";

export const enum ClientEvents {
  BoardsJoin = "boards:join",
  BoardsLeave = "boards:leave",
  ColumnsCreate = "columns:create",
}

export const enum ServerEvents {
  ColumnCreateSuccess = "columns:createSuccess",
  ColumnCreateFailure = "columns:createFailure",
}

export interface ServerToClientEvents extends Record<ServerEvents, Function> {
  [ServerEvents.ColumnCreateSuccess]: (column: Column) => void;
  [ServerEvents.ColumnCreateFailure]: (msg: string) => void;
}

export interface BoardsJoinInput {
  boardId: string;
}

export interface BoardsLeaveInput {
  boardId: string;
}

export interface ColumnCreateInput {
  boardId: string;
  title: string;
}

export interface ClientToServerEvents extends Record<ClientEvents, Function> {
  [ClientEvents.BoardsJoin]: (input: BoardsJoinInput) => void;
  [ClientEvents.BoardsLeave]: (input: BoardsLeaveInput) => void;
  [ClientEvents.ColumnsCreate]: (input: ColumnCreateInput) => void;
}

interface SocketData {
  user?: CurrentUser;
}

export type SocketIOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  SocketData
>;

export type SocketIOSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  SocketData
>;
