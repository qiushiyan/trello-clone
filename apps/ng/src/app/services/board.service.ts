import { Injectable } from '@angular/core';
import { Board } from '@trello-clone/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<Board | null>(null);

  constructor() {}

  setBoard(board: Board | null) {
    this.board$.next(board);
  }
}
