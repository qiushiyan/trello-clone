import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';
import { Board, ClientEvents } from '@trello-clone/types';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { BoardService } from 'src/app/services/board.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AlertComponent, InlineFormComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<Board>;

  createBoardFields: InlineFormFields = [
    { name: 'title', defaultValue: 'qiuqiu', required: true, type: 'text' },
    {
      name: 'description',
      defaultValue: 'qiuqiu description',
      required: false,
      type: 'textarea',
    },
  ];
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardsService: BoardsService,
    private boardService: BoardService,
    public authService: AuthService,
    private socketService: SocketService
  ) {
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.fetchBoard(this.boardId);
    this.socketService.joinBoard({ boardId: this.boardId });
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
  }
}
