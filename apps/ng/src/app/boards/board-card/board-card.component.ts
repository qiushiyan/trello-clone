import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class BoardCardComponent {
  @Input() title: string = '';
}
