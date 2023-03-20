import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { RequestInterceptor } from './request.interceptor';
import { UserService } from './user.service';
import { MenuComponent } from './components/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material.module';

function initializeAppFactory(userService: UserService): () => void {
  return () => {
    // Your initialize app codes go here 
    const state = localStorage.getItem('APPSTATE');
    if (state) {
      userService.state$.next(JSON.parse(state))
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AppNavComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/event' },
      { path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(module => module.AuthModule )},
      { path: 'event', loadChildren: ()=> import('./event/event.module').then(module => module.EventModule )},
      { path: 'user', loadChildren: () => import('./user/user.module').then(module => module.UserModule )},
      { path: '**', redirectTo: '/auth/signup' }
    ]),
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [UserService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
