import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';


@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: ':user_id', component: UserProfileComponent, canActivate: [() => { return inject(UserService).isLoggedIn() } ]},
      { path: '**', redirectTo: '/event' }
    ])
  ]
})
export class UserModule { }
