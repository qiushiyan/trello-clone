import { Injectable } from '@angular/core';
import { AppTheme } from '@trello-clone/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themes = ['cupcake', 'dracula'];
  currentTheme$ = new BehaviorSubject<AppTheme>(
    (localStorage.getItem('theme') || 'cupcake') as AppTheme
  );

  constructor() {
    const body = document.querySelector('body');
    body!.setAttribute(
      'data-theme',
      localStorage.getItem('theme') || 'cupcake'
    );
  }

  switchTheme(theme: AppTheme) {
    const nextTheme = theme === 'cupcake' ? 'dracula' : 'cupcake';
    const body = document.querySelector('body');
    body!.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    this.currentTheme$.next(nextTheme);
  }
}
