import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss'],
  standalone: true,
})
export class BoardCardComponent {
  @Input() title: string = '';
}
