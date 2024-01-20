import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent } from './modules/container/container.component';
import { MainContentComponent } from './modules/container/main-content/main-content.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { NotificationService } from './services/notification.service';
import { JwtModule } from "@auth0/angular-jwt";
import { tokenGetter } from './services/auth.service';

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
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost'],
        disallowedRoutes: [],
      },
    }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: ToastrService,
      useFactory: (service: NotificationService) => service,
      deps: [NotificationService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
