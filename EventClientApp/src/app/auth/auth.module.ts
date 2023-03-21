import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';

const guardLoggedInUser = () => { 
  const canActivate = !inject(UserService).isLoggedIn()
  if (!canActivate) {
    inject(Router).navigate(['','event']);
  }
  return canActivate
}

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent, canActivate: [ guardLoggedInUser ]},
      { path: 'signup', component: SignupComponent, canActivate: [ guardLoggedInUser ]}
    ])
  ]
})
export class AuthModule { }
