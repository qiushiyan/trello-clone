import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';
import {
  Board,
  ClientEvents,
  Column,
  ColumnCreateInput,
  ServerEvents,
} from '@trello-clone/types';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { BoardService } from 'src/app/services/board.service';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { ColumnsService } from 'src/app/services/columns.service';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AlertComponent, InlineFormComponent, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: Board | null;
    columns: Column[];
  }>;

  createBoardFields: InlineFormFields = [
    { name: 'title', defaultValue: 'Important', required: true, type: 'text' },
  ];
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private boardService: BoardService,
    private columnService: ColumnsService,
    public authService: AuthService,
    private socketService: SocketService
  ) {
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
    this.data$ = combineLatest([
      this.boardService.board$,
      this.boardService.columns$,
    ]).pipe(map(([board, columns]) => ({ board, columns })));
  }

  ngOnInit(): void {
    this.fetchBoard(this.boardId);
    this.socketService.joinBoard({ boardId: this.boardId });
    this.socketService
      .listen<Column>(ServerEvents.ColumnCreateSuccess)
      .subscribe({
        next: (column) => this.boardService.addColumn(column),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });
    this.initializeLeaveBoardListener();
  }

  initializeLeaveBoardListener() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.socketService.leaveBoard({ boardId: this.boardId });
        this.boardService.setBoard(null);
      }
    });
  }

  fetchBoard(boardId: string) {
    this.boardsService.getBoard(boardId).subscribe({
      next: (board) => {
        this.boardService.setBoard(board);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });

    this.columnService.getColumns(boardId).subscribe({
      next: (columns) => {
        this.boardService.setColumns(columns);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });
  }

  createColumn({ title }: { title: string }) {
    this.socketService.createColumn({ boardId: this.boardId, title });
  }
}
