import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'trello-clone';
  userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.getCurrentUser().subscribe({
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

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.userSubscription?.unsubscribe();
  }
}
