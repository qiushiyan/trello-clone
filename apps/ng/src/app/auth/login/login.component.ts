import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    RouterModule,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  error: string | null = null;

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  login() {
    this.authService
      .login({ email: this.email.value!, password: this.password.value! })
      .subscribe({
        next: (user) => {
          this.authService.setCurrentUser(user);
          this.authService.setToken(user.token);
          this.error = null;
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error.message;
        },
      });
  }

  ngOnInit(): void {}
}
