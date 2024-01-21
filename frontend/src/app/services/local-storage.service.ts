import { Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY_NAME } from '../core/constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // private STORAGE_KEY = 'photo_lib';

  // getData() {
  //   return JSON.parse(window.localStorage.getItem(this.STORAGE_KEY) || '{}');
  // }

  // setData(payload: any) {
  //   window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
  // }

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
