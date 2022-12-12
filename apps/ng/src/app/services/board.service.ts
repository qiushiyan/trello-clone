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

  updateColumn(column: Column) {
    this.columns$.next(
      this.columns$.value.map((c) => (c.id === column.id ? column : c))
    );
  }

  deleteColumn(column: Column) {
    this.columns$.next(this.columns$.value.filter((c) => c.id !== column.id));
  }

  setTasks(tasks: Task[]) {
    this.tasks$.next(tasks);
  }

  addTask(task: Task) {
    this.tasks$.next([...this.tasks$.value, task]);
  }

  deleteTask(task: Task) {
    this.tasks$.next(this.tasks$.value.filter((t) => t.id !== task.id));
  }

  updateTask(task: Task) {
    this.tasks$.next(
      this.tasks$.value.map((t) => (t.id === task.id ? task : t))
    );
  }
}
