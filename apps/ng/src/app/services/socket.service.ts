import { Injectable } from '@angular/core';
import {
  ClientToServerEvents,
  CurrentUser,
  ServerToClientEvents,
  ServerEvents,
  ClientEvents,
  BoardsJoinInput,
  BoardsLeaveInput,
  CreateColumnInput,
  CreateTaskInput,
  UpdateBoardInput,
  DeleteBoardInput,
} from '@trello-clone/types';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  boardId: string | null = null;

  constructor() {}

  createConnection(currentUser: CurrentUser) {
    this.socket = io(environment.api.socketio, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  listen<T>(event: ServerEvents) {
    if (this.socket) {
      return new Observable<T>((subscriber) => {
        this.socket!.on(event, (data: unknown) => {
          subscriber.next(data as T);
        });
      });
    } else {
      throw new Error('Socket is not connected');
    }
  }

  disconnect() {
    this.socket?.disconnect();
  }

  joinBoard(input: BoardsJoinInput) {
    this.socket?.emit(ClientEvents.BoardsJoin, input);
  }

  leaveBoard(input: BoardsLeaveInput) {
    this.socket?.emit(ClientEvents.BoardsLeave, input);
  }

  updateBoard(input: UpdateBoardInput) {
    this.socket?.emit(ClientEvents.BoardsUpdate, input);
  }

  deleteBoard(input: DeleteBoardInput) {
    this.socket?.emit(ClientEvents.BoardsDelete, input);
  }

  createColumn(input: CreateColumnInput) {
    this.socket?.emit(ClientEvents.ColumnsCreate, input);
  }

  createTask(input: CreateTaskInput) {
    this.socket?.emit(ClientEvents.TasksCreate, input);
  }
}
