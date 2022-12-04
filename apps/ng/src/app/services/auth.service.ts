import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUser } from '@trello-clone/types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginInput, RegisterInput } from '@trello-clone/types';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUser | null | undefined>(undefined);
  isLoggedIn$ = this.currentUser$.pipe(
    filter((user) => user !== undefined), // wait for the first value
    map((user) => !!user)
  );

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(environment.api.auth.currentUserUrl);
  }

  register(req: RegisterInput): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(environment.api.auth.registerUrl, req);
  }

  login(req: LoginInput): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(environment.api.auth.loginUrl, req);
  }

  logout() {
    this.setCurrentUser(null);
    localStorage.removeItem('token');
    this.socketService.disconnect();
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
}
