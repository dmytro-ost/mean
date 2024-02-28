import { Injectable } from '@angular/core';
import config from 'src/config';
import { HttpService } from './http.service';
import { TruckType, TrucksList } from '../models/truck.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ServerResponseMsg } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class TruckService {
  private readonly baseUrl: string = `${config.baseUrl}/api`;

  constructor(private readonly httpService: HttpService) { }

  public getTrucksList(): Observable<TrucksList> {
    return this.httpService.get<TrucksList>(`${this.baseUrl}/trucks/`);
  }

  public addTruck(truck: TruckType): Observable<ServerResponseMsg> {
    return this.httpService.post<ServerResponseMsg>(
      `${this.baseUrl}/trucks/`, truck);
  }

  public deleteTruck(id: string): Observable<ServerResponseMsg> {
    return this.httpService.delete<ServerResponseMsg>(
      `${this.baseUrl}/trucks/${id}/`);
  }

  public assignTruck(truckId: string): Observable<ServerResponseMsg> {
    return this.httpService.post<ServerResponseMsg>(
      `${this.baseUrl}/trucks/${truckId}/assign/`, null);
  }



}
