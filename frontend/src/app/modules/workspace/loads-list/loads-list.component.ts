import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadsList } from 'src/app/models/load.model';
import { LoadService } from 'src/app/services/load.service';

@Component({
  selector: 'app-loads-list',
  templateUrl: './loads-list.component.html',
  styleUrls: ['./loads-list.component.scss'],
})
export class LoadsListComponent implements OnInit {
  
  public loadsList$: Observable<LoadsList> = this.loadService.getLoadsList();

  constructor(private readonly loadService: LoadService) {}

  ngOnInit(): void {}
}
