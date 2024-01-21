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
    const params = new HttpParams();
    // .set('status', status || '')
    // .set('limit', limit || 0)
    // .set('offset', offset || 0);
    status ? params.set('status', status) : null;
    limit ? params.set('limit', limit) : null;
    offset ? params.set('offset', offset) : null;

    return this.httpService.get<LoadsList>(`${this.baseUrl}/loads/`, { params });

    // http://localhost:8080/api/loads?status=sdf&limit=23&offset=22
  }
}

// const params = new HttpParams()
// .set('isbn', isbn)
//   .set('companyCode', companyCode);

// public getSalesChannelTable(isbn: string, channels: string[]): Observable<SalesChannelTable> {
//   const httpParams = { params: new HttpParams({ fromString: channels.map(p => `channels=${p}`).join('&') }) };
//   return this.httpService.get<SalesChannelTable>(`${this.i207ApiUrl}/${isbn}/sales`, httpParams);
// }
