import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ToastrService {

  public badRequestError(errorResponse: HttpErrorResponse): void {
    if (errorResponse instanceof HttpErrorResponse && typeof errorResponse.error === 'string') {
      this.error(errorResponse.error);
    }

    if (errorResponse instanceof HttpErrorResponse && typeof errorResponse.error.message === 'string') {
      this.error(errorResponse.error.message);
    }

    if (errorResponse instanceof HttpErrorResponse && typeof errorResponse.message === 'string') {
      this.error(errorResponse.message);
    }

  }

  public handleUploadError(errorResponse: HttpErrorResponse, emptyFileMessage: string): void {
    this.error(errorResponse.message);
  }
}
