import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { RequestInterceptor } from './request.interceptor';
import { UserService } from './user.service';
import { MenuComponent } from './components/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material.module';

function initializeAppFactory(): (userService: UserService) => void {
  return () => {
    // Your initialize app codes go here 
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
      { path: '', component: AppComponent, pathMatch: 'full' },
      { path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(module => module.AuthModule )},
      { path: 'event', loadChildren: ()=> import('./event/event.module').then(module => module.EventModule )},
      { path: '**', redirectTo: '' }
    ]),
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
  ],
  providers: [ 
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [UserService]
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
