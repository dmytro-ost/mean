import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.modules';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { AddLoadComponent } from './add-load/add-load.component';
import { LoadsListComponent } from './loads-list/loads-list.component';



@NgModule({
  declarations: [
    WorkspaceComponent,
    AddLoadComponent,
    LoadsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkspaceRoutingModule
  ]
})
export class WorkspaceModule {}
