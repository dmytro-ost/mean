import { Component, OnInit } from '@angular/core';
import { map, catchError, EMPTY, filter, first, switchMap, Observable } from 'rxjs';
import { TrucksList } from 'src/app/models/truck.model';
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TruckService } from 'src/app/services/truck.service';

@Component({
  selector: 'app-loads-list-driver',
  templateUrl: './loads-list-driver.component.html',
  styleUrls: ['./loads-list-driver.component.scss'],
})
export class LoadsListDriverComponent implements OnInit{
  trucksList$!: Observable<TrucksList>;

  constructor(
    private readonly truckService: TruckService,
    private readonly toastr: NotificationService,
    private readonly dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getTrucksList();
  }

  getTrucksList() {
    this.trucksList$ =  this.truckService.getTrucksList();
  }

  radioSelected(truckId: string){
    this.truckService
      .assignTruck(truckId)
      .pipe(
        map((answer) => {
          this.toastr.info(answer.message);
        }),
        catchError((error) => {
          this.toastr.badRequestError(error);
          return EMPTY;
        })
      )
      .subscribe();
  };

  deleteTruck(truckId: string) {
    this.dialogService
      .openConfirmationDialog(
        'Ви впевнені, що бажаєте видалити цю машину? Якщо ви натиснете \'Так\' операцію не можна буде відмінити.',
        'Підтвердження видалення машини'
      )
      .pipe(
        first(),
        filter((confirmed) => confirmed),
        switchMap(() => {
          return this.truckService.deleteTruck(truckId)
            .pipe(
              map((answer) => {
                this.toastr.info(answer.message);
                this.getTrucksList();
              }),
              catchError((error) => {
                this.toastr.badRequestError(error);
                return EMPTY;
              })
            )
        })
      )
      .subscribe();
  }

  trackByFn(index: number, item: any) {
    return item._id;
  }
}
