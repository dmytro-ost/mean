import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModulesModule } from './material-modules/material-modules.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    SpinnerComponent,
    NotFoundComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModulesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MaterialModulesModule,
    SpinnerComponent,
    NotFoundComponent,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
