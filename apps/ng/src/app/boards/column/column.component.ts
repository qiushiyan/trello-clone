import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column, CreateTaskInput, Task } from '@trello-clone/types';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, InlineFormComponent, RouterModule, TaskComponent],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tasks: Task[] = [];
  boardId!: string;

  createBoardFields: InlineFormFields = [
    { name: 'title', defaultValue: '', required: true, type: 'text' },
  ];

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
  }

  createTask({ title }: { title: string }) {
    this.socketService.createTask({
      title,
      boardId: this.boardId,
      columnId: this.column.id,
    });
  }
}
