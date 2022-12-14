import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BoardsService } from 'src/app/services/boards.service';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { Board, CreateBoardInput } from '@trello-clone/types';
import { BoardComponent } from '../board/board.component';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { BoardCardComponent } from '../board-card/board-card.component';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-board-grid',
  standalone: true,
  imports: [
    CommonModule,
    BoardComponent,
    InlineFormComponent,
    BoardCardComponent,
    RouterModule,
    AlertComponent,
  ],
  templateUrl: './board-grid.component.html',
  styleUrls: ['./board-grid.component.scss'],
})
export class BoardGridComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  boardsSubscription: Subscription;
  error: string | null = null;
  createBoardFields: InlineFormFields = [
    {
      name: 'title',
      required: true,
      type: 'text',
      placeholder: 'board title',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private boardsService: BoardsService
  ) {
    this.boardsSubscription = this.boardsService.getBoards().subscribe({
      next: (boards) => (this.boards = boards),
      error: (err) => (this.error = String(err)),
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.boardsSubscription.unsubscribe();
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  createBoard(input: CreateBoardInput) {
    this.boardsService.createBoard(input).subscribe((board) => {
      this.boards = [...this.boards, board];
    });
  }

  trackByFn(index: number, board: Board) {
    return board.id;
  }
}
