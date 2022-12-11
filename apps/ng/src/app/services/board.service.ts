import { Injectable } from '@angular/core';
import { Board, Column } from '@trello-clone/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<Board | null>(null);
  columns$ = new BehaviorSubject<Column[]>([]);

  constructor() {}

  setBoard(board: Board | null) {
    this.board$.next(board);
  }

  setColumns(columns: Column[]) {
    this.columns$.next(columns);
  }

  addColumn(column: Column) {
    this.columns$.next([...this.columns$.value, column]);
  }
}
