import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks(boardId: string) {
    return this.http.get<[]>(
      `${environment.api.boards.getBoardsUrl}/${boardId}/tasks`
    );
  }

  // create task is in socket.service
}
