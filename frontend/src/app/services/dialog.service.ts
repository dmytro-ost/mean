import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private readonly dialog: MatDialog) {
  }

  public openConfirmationDialog(message: string, title?: string): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '650px';
    // dialogConfig.height = '200px';
    dialogConfig.data = { message, title };

    return this.dialog.open(ConfirmDialogComponent, dialogConfig).afterClosed();
  }


}
