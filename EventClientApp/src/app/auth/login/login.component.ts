import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  template: `

  <h1 class="title"> Log in to Eventizer </h1>
  <form class="form">
    
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

    <button mat-raised-button color="accent" class="full-width"  (click)="login">Login</button>

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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required] ]
  })


  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login() {
    
  }
}
