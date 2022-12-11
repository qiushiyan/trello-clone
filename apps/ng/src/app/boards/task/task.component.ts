import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@trello-clone/types';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task;

  constructor() {}
}
