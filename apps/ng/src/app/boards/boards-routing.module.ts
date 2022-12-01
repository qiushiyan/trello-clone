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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
