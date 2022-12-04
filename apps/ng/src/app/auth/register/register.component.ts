import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../components/input/input.component';
import {
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { EmailExistsValidator } from 'src/app/auth/validators/email';
import { HttpErrorResponse } from '@angular/common/http';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    RouterModule,
    AlertComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private emailExistsValidator: EmailExistsValidator,
    private sockerService: SocketService,
    private router: Router
  ) {}
  error: string | null = null;

  email: FormControl = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailExistsValidator.validate]
  );
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  username: FormControl = new FormControl('', [Validators.minLength(3)]);
  registerForm = new FormGroup({
    email: this.email,
    password: this.password,
    username: this.username,
  });

  register() {
    const data = {
      email: this.email.value,
      password: this.password.value,
      username: this.username.value || this.email.value,
    };
    this.authService.register(data).subscribe({
      next: (user) => {
        this.authService.setCurrentUser(user);
        this.authService.setToken(user.token);
        this.sockerService.createConnection(user);
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
