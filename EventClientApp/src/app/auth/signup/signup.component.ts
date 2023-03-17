import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  template: `
    <form [formGroup]="form"  class="main-form" (ngSubmit)="onSubmit()">
      <mat-form-field class="form-full-width">
        <mat-label>First Name</mat-label>
        <input matInput placeholder="Enter First Name" formControlName="firstname">
      </mat-form-field>
      <mat-form-field class="form-full-width">
        <mat-label>Last Name</mat-label>
        <input matInput placeholder="Enter Last Name" formControlName="lastname">
      </mat-form-field>
      <mat-form-field class="form-full-width">
        <mat-label>Email</mat-label>
        <input matInput placeholder="Enter Your Email" formControlName="email">
      </mat-form-field>
      <mat-form-field class="form-full-width">
        <mat-label>Password</mat-label>
        <input type="password" matInput placeholder="Type password" formControlName="password">
      </mat-form-field>
      <mat-form-field class="form-full-width">
        <mat-label>Confirm Password</mat-label>
        <input type="password" matInput placeholder="Type again" formControlName="confirmPassword">
      </mat-form-field>
      <div *ngIf="">Invalid Password</div>
      <mat-form-field class="form-full-width">
        <mat-label>Location Latitude</mat-label>
        <input type="text" matInput placeholder="Type again" formControlName="location.lat">
      </mat-form-field>
      <mat-form-field  class="form-full-width">
        <mat-label>Location Longitude</mat-label>
        <input type="text" matInput placeholder="Type again" formControlName="location.lang">
      </mat-form-field>
      <mat-form-field class="form-full-width">
        <mat-label>Bio</mat-label>
        <input type="text" matInput placeholder="Enter Your Bio" formControlName="bio">
      </mat-form-field>
      <!-- <mat-form-field class="form-full-width">
        <button type="button" mat-raised-button (click)="fileInput.click()">Choose File</button>
        <input hidden #fileInput type="file" formControlName="profile"> 
        (change)="onFileSelected($event)" 
      </mat-form-field> -->
      <button mat-raised-button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `,
  styles: [
  ]
})
export class SignupComponent {
  form = inject(FormBuilder).nonNullable.group({
    firstname: [''],
    lastname: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
    location: [{
      lat: '',
      long: ''
    }],
    bio: [''],
    profile: [''],
  })

  onSubmit() {
    console.log("Submitting");

  }
}
