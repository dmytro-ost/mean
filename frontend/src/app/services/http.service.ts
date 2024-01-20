import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpOptions, TextHttpOptions } from '../core/http-options';
import { finalize } from 'rxjs/internal/operators/finalize';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private readonly http: HttpClient,
    private readonly spinnerService: SpinnerService
    ) { }

    public get<T>(url: string, options?: HttpOptions, preventSpinner?: boolean): Observable<T> {
        this.spinnerService.show();
      return this.http.get<T>(url, options).pipe(
        finalize(() => this.spinnerService.hide())
      );
    }

    public post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
      this.spinnerService.show();
      return this.http.post<T>(url, body, options).pipe(
        finalize(() => this.spinnerService.hide())
      );
    }

    public put<T>(url: string, body: any): Observable<T> {
      this.spinnerService.show();
      return this.http.put<T>(url, body).pipe(
        finalize(() => this.spinnerService.hide())
      );
    }

    public patch<T>(url: string, body: any): Observable<T> {
      this.spinnerService.show();
      return this.http.patch<T>(url, body).pipe(
        finalize(() => this.spinnerService.hide())
      );
    }

    public delete<T>(url: string, body?: any, params?: HttpParams): Observable<T> {
      this.spinnerService.show();

      const options: HttpOptions = { params };

      if (body) {
        options.headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });

        options.body = body;
      }

      return this.http.delete<T>(url, options).pipe(
        finalize(() => this.spinnerService.hide())
      );
    }

}
