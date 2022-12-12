import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';
import {
  Board,
  Column,
  ServerEvents,
  Task,
  UpdateBoardInput,
} from '@trello-clone/types';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import {
  InlineFormField,
  InlineFormFields,
} from 'src/app/types/inline-form.interface';
import { BoardService } from 'src/app/services/board.service';
import {
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { ColumnsService } from 'src/app/services/columns.service';
import { ColumnComponent } from '../column/column.component';
import { TasksService } from 'src/app/services/tasks.service';
import { InlineOnelineFormComponent } from 'src/app/components/inline-oneline-form/inline-oneline-form.component';
import { MarkdownService, MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    InlineFormComponent,
    ColumnComponent,
    InlineOnelineFormComponent,
    MarkdownModule,
    RouterModule,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  data$: Observable<{
    board: Board | null;
    columns: Column[];
    tasks: Task[];
  }>;

  boards$: Observable<Board[]>;
  unsubscribe$ = new Subject<void>();

  createBoardFields: InlineFormFields = [
    {
      name: 'title',
      defaultValue: 'board title',
      required: true,
      type: 'text',
    },
    {
      name: 'description',
      defaultValue: 'board description',
      required: false,
      type: 'textarea',
    },
  ];

  updateBoardTitleField: InlineFormField = {
    name: 'title',
    defaultValue: 'board title',
    required: true,
    type: 'text',
  };

  updateBoardDescriptionField: InlineFormField = {
    name: 'description',
    defaultValue: 'board description',
    required: false,
    type: 'textarea',
  };

  createColumnField: InlineFormField = {
    name: 'title',
    defaultValue: '',
    required: true,
    type: 'text',
  };

  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private boardService: BoardService,
    private columnsService: ColumnsService,
    private taskServioce: TasksService,
    public authService: AuthService,
    private socketService: SocketService,
    private markdownService: MarkdownService
  ) {
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
    this.boards$ = this.boardsService.getBoards();
    this.data$ = combineLatest([
      this.boardService.board$,
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => {
        return { board, columns, tasks };
      })
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
      this.fetchBoard(this.boardId);
      this.socketService.joinBoard({ boardId: this.boardId });
    });

    // update board
    this.socketService
      .listen<Board>(ServerEvents.BoardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (board) => {
          this.boardService.setBoard(board);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // delete board
    this.socketService
      .listen<void>(ServerEvents.BoardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // create column
    this.socketService
      .listen<Column>(ServerEvents.ColumnCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (column) => this.boardService.addColumn(column),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // update column
    this.socketService
      .listen<Column>(ServerEvents.ColumnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (column) => this.boardService.updateColumn(column),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // delete column
    this.socketService
      .listen<Column>(ServerEvents.ColumnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (column) => this.boardService.deleteColumn(column),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // create task
    this.socketService
      .listen<Task>(ServerEvents.TasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (task) => this.boardService.addTask(task),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // update task
    this.socketService
      .listen<Task>(ServerEvents.TasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (task) => this.boardService.updateTask(task),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // delete task
    this.socketService
      .listen<Task>(ServerEvents.TasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (task) => this.boardService.deleteTask(task),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    this.initializeLeaveBoardListener();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeLeaveBoardListener() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        this.socketService.leaveBoard({ boardId: this.boardId });
        this.boardService.setBoard(null);
        this.boardService.setColumns([]);
        this.boardService.setTasks([]);
      }
    });
  }

  fetchBoard(boardId: string) {
    this.boardsService.getBoard(boardId).subscribe({
      next: (board) => {
        this.boardService.setBoard(board);
        this.updateBoardTitleField.defaultValue = board.title;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });

    this.columnsService.getColumns(boardId).subscribe({
      next: (columns) => {
        this.boardService.setColumns(columns);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });

    this.taskServioce.getTasks(boardId).subscribe({
      next: (tasks) => {
        this.boardService.setTasks(tasks);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });
  }

  async switchBoard(boardTitle: string) {
    const boards = await lastValueFrom(this.boards$);
    const board = boards.find((board) => board.title === boardTitle);
    if (board) {
      this.router.navigate(['/boards', board.id]);
    }
  }

  updateBoardTitle({ title }: { title: string }) {
    const input: UpdateBoardInput = { id: this.boardId, fields: { title } };
    this.socketService.updateBoard(input);
  }

  updateBoardDescription({ description }: { description: string }) {
    const input: UpdateBoardInput = {
      id: this.boardId,
      fields: { description },
    };
    this.socketService.updateBoard(input);
  }

  updateBoard({ title, description }: { title: string; description: string }) {
    const input: UpdateBoardInput = {
      id: this.boardId,
      fields: { title, description },
    };
    this.socketService.updateBoard(input);
  }

  deleteBoard(event: Event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this board?')) {
      this.socketService.deleteBoard({ id: this.boardId });
    }
  }

  createColumn({ title }: { title: string }) {
    this.socketService.createColumn({ boardId: this.boardId, title });
  }

  createTask({ title, columnId }: { title: string; columnId: string }) {
    this.socketService.createTask({ boardId: this.boardId, title, columnId });
  }

  getTasksByColumnId(tasks: Task[], columnId: string): Task[] {
    return tasks.filter((task) => task.columnId === columnId);
  }
}
