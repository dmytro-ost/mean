import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent } from './modules/container/container.component';
import { MainContentComponent } from './modules/container/main-content/main-content.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { JwtTokenInterceptor } from './core/jwt-token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    MainContentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: ToastrService,
      useFactory: (service: NotificationService) => service,
      deps: [NotificationService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
