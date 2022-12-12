import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// prefix /boards
const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./board-grid/board-grid.component').then(
        (m) => m.BoardGridComponent
      ),
    title: 'Trello | Boards',
  },
  {
    path: ':boardId',
    loadComponent: () =>
      import('./board/board.component').then((m) => m.BoardComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
