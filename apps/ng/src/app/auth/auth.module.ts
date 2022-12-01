import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [AuthRoutingModule],
  providers: [HttpClientModule],
})
export class AuthModule {}
