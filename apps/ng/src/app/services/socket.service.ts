import { Injectable } from '@angular/core';
import {
  ClientToServerEvents,
  CurrentUser,
  ServerToClientEvents,
  ClientEvents,
  BoardsJoinInput,
  BoardsLeaveInput,
  ColumnCreateInput,
} from '@trello-clone/types';
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

  disconnect() {
    this.socket?.disconnect();
  }

  joinBoard(input: BoardsJoinInput) {
    this.socket?.emit(ClientEvents.BoardsJoin, input);
  }

  leaveBoard(input: BoardsLeaveInput) {
    this.socket?.emit(ClientEvents.BoardsLeave, input);
  }

  createColumn(input: ColumnCreateInput) {
    this.socket?.emit(ClientEvents.ColumnsCreate, input);
  }
}
