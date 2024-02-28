import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.modules';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddLoadComponent } from './add-load/add-load.component';
import { LoadsListComponent } from './loads-list/loads-list.component';
import { LoadsListDriverComponent } from './loads-list-driver/loads-list-driver.component';
import { LoadsListShipperComponent } from './loads-list-shipper/loads-list-shipper.component';
import { AddTruckComponent } from './add-truck/add-truck.component';



@NgModule({
  declarations: [
    WorkspaceComponent,
    AddLoadComponent,
    LoadsListComponent,
    LoadsListDriverComponent,
    LoadsListShipperComponent,
    AddTruckComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkspaceRoutingModule
  ]
})
export class WorkspaceModule {}
