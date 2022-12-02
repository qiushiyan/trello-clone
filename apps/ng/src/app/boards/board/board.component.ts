import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';
import { Board } from '@trello-clone/types';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { InlineFormFields } from 'src/app/types/inline-form.interface';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AlertComponent, InlineFormComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board?: Board;

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
    private boardService: BoardsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    this.boardService.getBoard(boardId!).subscribe({
      next: console.log,
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message;
      },
    });
  }
}
