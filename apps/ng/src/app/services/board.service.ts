import { Injectable } from '@angular/core';
import { Board, Column, Task } from '@trello-clone/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<Board | null>(null);
  columns$ = new BehaviorSubject<Column[]>([]);
  tasks$ = new BehaviorSubject<Task[]>([]);

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

  setTasks(tasks: Task[]) {
    this.tasks$.next(tasks);
  }

  addTask(task: Task) {
    this.tasks$.next([...this.tasks$.value, task]);
  }
}
