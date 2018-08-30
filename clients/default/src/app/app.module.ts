import { AppService } from './app.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
export function appInit(app: AppService) {
  return async () => {
    await app.init();
  }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }, {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    multi: true,
    deps: [
      AppService
    ]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
