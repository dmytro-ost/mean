import { Injectable } from '@angular/core';
import { UserInfo } from '../models/user.mode';
import { ACCESS_TOKEN_KEY_NAME, LOGIN_ROUTE } from '../core/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Router, UrlTree } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY_NAME);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isAuthorized$ = new BehaviorSubject<boolean>(false);
  public readonly isAuthorized$ = this._isAuthorized$.asObservable();

  private readonly jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService
  ) { }

  public getCurrentUserInfo(): UserInfo {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY_NAME) || '';
    const tokenData = this.jwtHelper.decodeToken(token);
    return tokenData;
  }

  public hasRole(): boolean {
    return !!this.getCurrentUserInfo()?.role;
  }

  public hasAuthentification$(): Observable<true | UrlTree> {
    this.setLogin();

    return this.isAuthorized$.pipe(
      map((isAuth) => {
        return isAuth ? isAuth : this.router.createUrlTree([LOGIN_ROUTE]);
      })
    );
  }

  public setLogin() {
    if (!this.hasRole()) return;

    this._isAuthorized$.next(true);
  }

  public setLogOut() {
    this.localStorageService.removeToken();
    this._isAuthorized$.next(false);
    this.router.navigate([LOGIN_ROUTE]);
  }
}
