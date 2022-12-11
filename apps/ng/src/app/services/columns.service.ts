import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Column } from '@trello-clone/types';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient) {}

  getColumns(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(
      `${environment.api.boards.getBoardsUrl}/${boardId}/columns`
    );
  }

  // create column is in socket.service.ts
}
