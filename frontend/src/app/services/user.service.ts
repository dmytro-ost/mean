import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import config from 'src/config';
import {  User } from '../models/user.mode';
import { Observable } from 'rxjs';
import { ResponseJWT, ServerResponseMsg } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl: string = `${config.baseUrl}/api`;

  constructor(
    private readonly httpService: HttpService
  ) { }

  public registerNewUser(user: User): Observable<ServerResponseMsg> {
    return this.httpService.post<ServerResponseMsg>(`${this.baseUrl}/auth/register/`, user);
  }

  public login(user: Omit<User, 'role'>): Observable<ResponseJWT> {
    return this.httpService.post<ResponseJWT>(`${this.baseUrl}/auth/login/`, user);
  }

  // public getAvailableFieldsByCompanyCode(companyCode: string): Observable<ListValue[]> {
  //   return this.httpService.get<ListValue[]>(`${this.baseUrl}/available-fields/${companyCode}/`);
  // }

  // public getUserSettingsByCompanyCode(companyCode: string): Observable<ResultingFields> {
  //   return this.httpService.get<ResultingFields>(`${this.baseUrl}/${companyCode}/`);
  // }

  // public saveUserSettings(companyCode: string, userSettings: ResultingFieldIDs): Observable<void> {
  //   return this.httpService.put<void>(`${this.baseUrl}/${companyCode}/`, userSettings);
  // }

}
