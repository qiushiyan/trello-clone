import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@trello-clone/types';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { SocketService } from 'src/app/services/socket.service';
import { InlineFormComponent } from 'src/app/components/inline-form/inline-form.component';
import { InlineFormFields } from 'src/app/types/inline-form.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, MarkdownModule, InlineFormComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task;
  isExpandable: boolean = false;
  isExpanded: boolean = false;

  updateTaskFields: InlineFormFields = [
    {
      name: 'title',
      defaultValue: 'task title',
      required: true,
      type: 'text',
    },
    {
      name: 'description',
      defaultValue: 'task description',
      required: false,
      type: 'textarea',
    },
  ];

  constructor(
    private markdownService: MarkdownService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.isExpandable =
      !!this.task.description || this.task.attachments.length > 0;
  }

  toggleDetails() {
    this.isExpanded = !this.isExpanded;
  }

  updateTask({ title, description }: { title: string; description: string }) {
    this.socketService.updateTask({
      id: this.task.id,
      fields: {
        title,
        description,
      },
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.socketService.deleteTask({
        id: this.task.id,
      });
    }
  }
}
