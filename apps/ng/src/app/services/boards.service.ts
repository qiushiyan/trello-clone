import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Board, CreateBoardInput } from '@trello-clone/types';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}
  boards: Board[] = [];

  gaetBoards() {
    return this.http.get<[]>(environment.api.boards.getBoardsUrl);
  }

  getBoard(boardId: string) {
    return this.http.get<Board>(
      `${environment.api.boards.getBoardsUrl}/${boardId}`
    );
  }

  createBoard(input: CreateBoardInput) {
    return this.http.post<Board>(environment.api.boards.createBoardUrl, input);
  }
}
