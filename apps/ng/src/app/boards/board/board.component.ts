import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';
import {
  Board,
  Column,
  ServerEvents,
  Task,
  UpdateBoardInput,
} from '@trello-clone/types';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import {
  InlineFormField,
  InlineFormFields,
} from 'src/app/types/inline-form.interface';
import { BoardService } from 'src/app/services/board.service';
import { combineLatest, map, Observable } from 'rxjs';
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
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: Board | null;
    columns: Column[];
    tasks: Task[];
  }>;

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
    this.fetchBoard(this.boardId);
    this.socketService.joinBoard({ boardId: this.boardId });

    // create column
    this.socketService
      .listen<Column>(ServerEvents.ColumnCreateSuccess)
      .subscribe({
        next: (column) => this.boardService.addColumn(column),
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        },
      });

    // create task
    this.socketService.listen<Task>(ServerEvents.TasksCreateSuccess).subscribe({
      next: (task) => this.boardService.addTask(task),
      error: (err: HttpErrorResponse) => {
        this.error = err.message;
      },
    });

    // update board
    this.socketService
      .listen<Board>(ServerEvents.BoardsUpdateSuccess)
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
      .subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        },
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
