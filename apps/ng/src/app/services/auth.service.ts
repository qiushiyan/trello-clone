import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUser } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegisterRequest } from '../types/request.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUser | null | undefined>(undefined);
  isLoggedIn$ = this.currentUser$.pipe(
    filter((user) => user !== undefined), // wait for the first value
    map((user) => !!user)
  );

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(environment.api.auth.currentUserUrl);
  }

  register(req: RegisterRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(environment.api.auth.registerUrl, req);
  }

  login(req: LoginRequest): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(environment.api.auth.loginUrl, req);
  }

  isEmailExists(email: string) {
    return this.http.post<{ exists: boolean }>(
      environment.api.auth.isEmailExistsUrl,
      {
        email,
      }
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setCurrentUser(currentUser: CurrentUser | null) {
    this.currentUser$.next(currentUser);
  }

  constructor(private http: HttpClient) {}
}
