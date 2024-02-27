import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, catchError, concatMap, first, filter, switchMap } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { LoadsList, LoadsListTable } from 'src/app/models/load.model';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadService } from 'src/app/services/load.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-loads-list',
  templateUrl: './loads-list.component.html',
  styleUrls: ['./loads-list.component.scss'],
})
export class LoadsListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  loadsData!: LoadsListTable[];
  displayedColumns: string[] = [
    'name',
    '_id',
    'created_date',
    'payload',
    'status',
    'pickup_address',
    'delivery_address',
    'dimensions',
    'actions',
  ];

  dataSource!: MatTableDataSource<LoadsListTable>;

  constructor(
    private readonly loadService: LoadService,
    private readonly toastr: NotificationService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  private loadTableData() {
    this.loadService
      .getLoadsList()
      .subscribe((data) => this.formatTableData(data));
  }

  private formatTableData(srcData: LoadsList) {
    this.loadsData = srcData.loads.map((row) => {
      return Object.keys(row)
        .filter((key) => this.displayedColumns.includes(key))
        .reduce((obj, key) => {
          obj[key as keyof typeof obj] = row[key as keyof typeof obj];
          return obj;
        }, {}) as LoadsListTable;
    });

    this.dataSource = new MatTableDataSource(this.loadsData);
    this.dataSource.sort = this.sort;
  }

  public onDeleteClick(item: LoadsListTable) {
    this.dialogService
      .openConfirmationDialog(
        'Ви впевнені, що бажаєте видалити цей груз? Якщо ви натиснете \'Так\' операцію не можна буде відмінити.',
        'Підтвердження видалення грузу'
      )
      .pipe(
        first(),
        filter((confirmed) => confirmed),
        switchMap(() => {
          return this.loadService.deleteLoad(item._id).pipe(
            map((answer) => {
              this.toastr.info(answer.message);
              this.loadTableData();
            }),
            catchError((error) => {
              this.toastr.badRequestError(error);
              return EMPTY;
            })
          );
        })
      )
      .subscribe();
  }

  public onSearchClick(item: LoadsListTable) {
    this.loadService
      .searchForDrivers(item._id)
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
