import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsService } from 'src/app/services/boards.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private boardService: BoardsService) {}

  ngOnInit(): void {}
}
