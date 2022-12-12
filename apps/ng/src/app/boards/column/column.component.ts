import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column, CreateTaskInput, Task } from '@trello-clone/types';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import {
  InlineFormField,
  InlineFormFields,
} from 'src/app/types/inline-form.interface';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { TaskComponent } from '../task/task.component';
import { InlineOnelineFormComponent } from 'src/app/components/inline-oneline-form/inline-oneline-form.component';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    InlineFormComponent,
    RouterModule,
    TaskComponent,
    InlineOnelineFormComponent,
    MarkdownModule,
  ],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tasks: Task[] = [];
  boardId!: string;

  updateColumnField: InlineFormField = {
    name: 'title',
    defaultValue: '',
    required: true,
    type: 'text',
  };

  createTaskFields: InlineFormFields = [
    {
      name: 'title',
      defaultValue: '',
      required: true,
      type: 'text',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string;
  }

  updateColumnTitle({ title }: { title: string }) {
    this.socketService.updateColumn({
      id: this.column.id,
      fields: {
        title,
      },
    });
  }

  deleteColumn() {
    if (confirm('Are you sure you want to delete this column?')) {
      this.socketService.deleteColumn({
        id: this.column.id,
      });
    }
  }

  createTask({ title }: { title: string }) {
    this.socketService.createTask({
      title,
      boardId: this.boardId,
      columnId: this.column.id,
    });
  }
}
