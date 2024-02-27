import { Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY_NAME } from '../core/constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public saveToken(token: string) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY_NAME, token);
  }

  public getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY_NAME);
  }

  public removeToken() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY_NAME);
  }
}
