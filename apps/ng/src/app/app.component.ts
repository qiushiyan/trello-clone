import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'trello-clone';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        console.log(currentUser);
        this.authService.setToken(currentUser.token);
        this.authService.setCurrentUser(currentUser);
      },
      error: (err: HttpErrorResponse) => {
        this.authService.setCurrentUser(null);
      }, // unauthenticated
    });
  }
}
