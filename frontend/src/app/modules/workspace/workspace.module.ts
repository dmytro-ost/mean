import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.modules';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';



@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WorkspaceRoutingModule
  ]
})
export class WorkspaceModule {}
