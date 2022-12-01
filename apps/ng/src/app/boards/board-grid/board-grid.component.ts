import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { BoardsService } from 'src/app/services/boards.service';

@Component({
  selector: 'app-board-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-grid.component.html',
  styleUrls: ['./board-grid.component.scss'],
})
export class BoardGridComponent implements OnInit {
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
    this.boardsService.getBoards().subscribe(console.log);
  }
}
