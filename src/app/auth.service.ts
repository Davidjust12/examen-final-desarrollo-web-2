import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  authenticated = signal(sessionStorage.getItem('rickflix-session') === 'admin');
  login(username: string, password: string) { if (username.trim() !== 'admin' || password !== 'admin123') return false; sessionStorage.setItem('rickflix-session', 'admin'); this.authenticated.set(true); return true; }
  logout() { sessionStorage.removeItem('rickflix-session'); this.authenticated.set(false); }
}
export const authGuard: CanActivateFn = (_route, state) => inject(AuthService).authenticated() || inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
