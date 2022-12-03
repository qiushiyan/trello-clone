import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsService } from '../services/boards.service';

@NgModule({
  imports: [CommonModule, BoardsRoutingModule],
  providers: [BoardsService],
})
export class BoardsModule {}
