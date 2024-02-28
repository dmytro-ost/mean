import { Component, OnInit } from '@angular/core';
import { map, catchError, EMPTY } from 'rxjs';
import { TruckModel, TruckType } from 'src/app/models/truck.model';
import { NotificationService } from 'src/app/services/notification.service';
import { TruckService } from 'src/app/services/truck.service';

@Component({
  selector: 'app-add-truck',
  templateUrl: './add-truck.component.html',
  styleUrls: ['./add-truck.component.scss'],
})
export class AddTruckComponent {
  constructor(
    private readonly truckService: TruckService,
    private readonly toastr: NotificationService
  ) {}

  currentTruck!: string;

  trucks: string[] = [
    TruckModel.SPRINTER,
    TruckModel.SMALL_STRAIGHT,
    TruckModel.LARGE_STRAIGHT,
  ];

  public addTruck() {
    if (!this.currentTruck) {
      this.toastr.warning('Треба вибрати якусь машину!');
      return;
    }

    this.truckService
      .addTruck({ type: this.currentTruck } as TruckType)
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
  }
}
