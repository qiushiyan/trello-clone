import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BoardsService } from 'src/app/services/boards.service';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { Board } from '@trello-clone/types';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-board-grid',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './board-grid.component.html',
  styleUrls: ['./board-grid.component.scss'],
})
export class BoardGridComponent implements OnInit {
  boards: Board[] = [];
  createBoardFields: InlineFormFields = [
    {
      name: 'name',
      required: true,
      type: 'text',
      minLength: 3,
      defaultValue: 'name',
    },
    {
      name: 'description',
      required: false,
      type: 'text',
      minLength: 3,
      defaultValue: 'description',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private boardsService: BoardsService
  ) {}

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    this.boardsService.gaetBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }
}
