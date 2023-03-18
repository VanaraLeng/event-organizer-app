import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';
import jwt_decode from 'jwt-decode';
import IState from 'src/app/IState.interface';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-login',
  template: `
  <h1 class="title"> Log in to Eventizer </h1>
  <form class="form" [formGroup]="form" (ngSubmit)="login()">
    
    <mat-form-field appearance="fill" class="full-width">
      <mat-label>Enter your email</mat-label>
      <input matInput placeholder="mwa@gmail.com" formControlName="email" required>
      <mat-error *ngIf="email.invalid">{{getErrorMessage()}}</mat-error>
    </mat-form-field> 
    <br>

    <mat-form-field appearance="fill" class="full-width">
      <mat-label>Enter your password</mat-label>
      <input matInput [type]="hide ? 'password' : 'text'" formControlName="password">
      <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">
        <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
      </button>
    </mat-form-field>
    <br>

    <button mat-raised-button color="accent" class="full-width" [disabled]="form.invalid">Login</button>

    <br>
    <br>
    Don't have account yet? 
    <button mat-button [routerLink]="['','auth','signup']">Sign Up Now</button>

    

  </form>
  `,
  styles: [`
  .title {
    padding-top: 12px;
    width: 100%;
    text-align: center;
  }
  .form {
    margin: 0 auto;
    min-width: 150px;
    max-width: 500px;
    width: 100%;
    padding: 12px;
  }
  .full-width {
    width: 100%;
  }

  `
  ]
})
export class LoginComponent {

  form = inject(FormBuilder).group({
    email: ['john.wick@gmail.com', [Validators.required, Validators.email]],
    password: ['1234', [Validators.required] ]
  })

  
  userService = inject(UserService);
  notification = inject(MatSnackBar);
  router = inject(Router)

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login() {

    const param = this.form.value
    this.userService.login(param).subscribe({
      next: (res) => {

        if (res.success === true) {
          
          const { _id, firstName, lastName, email, location, bio, token } = jwt_decode(res.data.token) as IState
          // Store user state
          const state = {
            _id,
            firstName,
            lastName,
            email,
            location,
            bio,
            token : res.data.token
          }
          
          // update state$ value
          this.userService.state$.next(state)
          // Store in local storage 
          localStorage.setItem('APPSTATE', JSON.stringify(state))
          this.router.navigate([''])
          console.log("login success");

        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000} )      
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000} )    
      }
    })
  }
}
