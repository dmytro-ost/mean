import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponseMsg, ResponseJWT } from '../models/message.model';
import { HttpService } from './http.service';
import config from 'src/config';
import { Load, LoadsList } from '../models/load.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  private readonly baseUrl: string = `${config.baseUrl}/api`;

  constructor(private readonly httpService: HttpService) {}

  public createNewLoad(load: Load): Observable<ServerResponseMsg> {
    return this.httpService.post<ServerResponseMsg>(
      `${this.baseUrl}/loads/`,
      load
    );
  }

  public getLoadsList(
    status?: string,
    limit?: number,
    offset?: number
  ): Observable<LoadsList> {
    const params = new HttpParams()
      .set('status', status || '')
      .set('limit', limit || 0)
      .set('offset', offset || 0);

    return this.httpService.get<LoadsList>(`${this.baseUrl}/loads/`, {
      params,
    });
  }

  public searchForDrivers(loadId: string): Observable<ServerResponseMsg> {
    return this.httpService.post<ServerResponseMsg>(
      `${this.baseUrl}/loads/${loadId}/post/`,
      null
    );
  }

  public deleteLoad(loadId: string): Observable<ServerResponseMsg> {
    return this.httpService.delete<ServerResponseMsg>(
      `${this.baseUrl}/loads/${loadId}/`
    );
  }
}
