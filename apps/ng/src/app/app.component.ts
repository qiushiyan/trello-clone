import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'trello-clone';

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.authService.setToken(currentUser.token);
        this.authService.setCurrentUser(currentUser);
        this.socketService.createConnection(currentUser);
      },
      error: (err: HttpErrorResponse) => {
        this.authService.setCurrentUser(null);
      }, // unauthenticated
    });
  }
}
