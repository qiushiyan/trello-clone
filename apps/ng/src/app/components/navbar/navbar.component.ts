import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUser, AppTheme } from '@trello-clone/types';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: CurrentUser | null = null;
  theme!: AppTheme;
  constructor(
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  switchTheme(theme: AppTheme) {
    this.themeService.switchTheme(theme);
  }
}
