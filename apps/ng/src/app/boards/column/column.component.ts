import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '@trello-clone/types';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  @Input() column!: Column;

  constructor() {}
}
