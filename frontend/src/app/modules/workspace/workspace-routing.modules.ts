import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoadsListComponent } from './loads-list/loads-list.component';
import { AddLoadComponent } from './add-load/add-load.component';
import { AddTruckComponent } from './add-truck/add-truck.component';


const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        component: LoadsListComponent
      },
      {
        path: 'addload',
        component: AddLoadComponent
      },
      {
        path: 'addtruck',
        component: AddTruckComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
