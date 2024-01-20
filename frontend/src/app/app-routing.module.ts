import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './modules/container/container.component';
import { AuthGuard } from './core/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LOGIN_ROUTE, WORKSPACE_ROUTE } from './core/constants';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: '', redirectTo: WORKSPACE_ROUTE, pathMatch: 'full'
      },
      {
        path: LOGIN_ROUTE,
        loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      },
      {
        path: WORKSPACE_ROUTE,
        loadChildren: () => import('./modules/workspace/workspace.module').then(m=>m.WorkspaceModule),
        canActivate: [AuthGuard]
      },

    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
