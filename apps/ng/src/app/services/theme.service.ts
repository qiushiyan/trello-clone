import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themes = ['cupcake', 'dracula'];
  currentTheme$ = new BehaviorSubject<any>(
    localStorage.getItem('theme') || 'cupcake'
  );

  constructor() {}

  switchTheme(theme: 'cupcake' | 'dracula') {
    const nextTheme = theme === 'cupcake' ? 'dracula' : 'cupcake';
    this.currentTheme$.next(nextTheme);
    const body = document.querySelector('body');
    body!.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
