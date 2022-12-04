import { Server, Socket } from "socket.io";
import { CurrentUser } from "./user";

export const enum ClientEvents {
  BoardsJoin = "boards:join",
  BoardsLeave = "boards:leave",
}

export const enum ServerEvents {}

export interface ServerToClientEvents extends Record<ServerEvents, Function> {}

export interface BoardsJoinInput {
  boardId: string;
}

export interface BoardsLeaveInput {
  boardId: string;
}

export interface ClientToServerEvents extends Record<ClientEvents, Function> {
  "boards:join": (input: BoardsJoinInput) => void;
  "boards:leave": (input: BoardsLeaveInput) => void;
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
