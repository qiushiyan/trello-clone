import { Server, Socket } from "socket.io";
export declare const enum ClientEvents {
    BoardsJoin = "boards:join",
    BoardsLeave = "boards:leave"
}
export declare const enum ServerEvents {
}
export interface ServerToClientEvents extends Record<ServerEvents, Function> {
}
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
export declare type SocketIOServer = Server<ClientToServerEvents, ServerToClientEvents, any, any>;
export declare type SocketIOSocket = Socket<ClientToServerEvents, ServerToClientEvents, any, any>;
