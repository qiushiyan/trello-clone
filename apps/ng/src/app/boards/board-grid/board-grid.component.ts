import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BoardsService } from 'src/app/services/boards.service';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { Board, CreateBoardInput } from '@trello-clone/types';
import { BoardComponent } from '../board/board.component';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { BoardCardComponent } from '../board-card/board-card.component';

@Component({
  selector: 'app-board-grid',
  standalone: true,
  imports: [
    CommonModule,
    BoardComponent,
    InlineFormComponent,
    BoardCardComponent,
  ],
  templateUrl: './board-grid.component.html',
  styleUrls: ['./board-grid.component.scss'],
})
export class BoardGridComponent implements OnInit {
  boards: Board[] = [];
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
  ) {}

  ngOnInit(): void {
    this.boardsService.gaetBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  createBoard(input: CreateBoardInput) {
    this.boardsService.createBoard(input).subscribe((board) => {
      this.boards.push(board);
    });
  }
}
