import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form = inject(FormBuilder).group({
    firstname: [''],
    lastname: [''],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    confirmPassword: [''],
    latitude: [''],
    longitude: [''],
    bio: [''],
    profiles: [''],
    address: ['']
  })
  email = new FormControl('', [Validators.required, Validators.email]);
  passwordTyped = new FormControl('', [Validators.required]);
  signup = true;
  profile = ''
  address = ''

  userService = inject(UserService);
  notification = inject(MatSnackBar);
  router = inject(Router)

  onNgInit() {
    this.signup = true;
  }

  onSubmit() {
    const params = {
      "firstName": this.form.value.firstname,
      "lastName": this.form.value.lastname,
      "email": this.form.value.email,
      "password": this.form.value.password,
      "bio": this.form.value.bio,
      "location": [this.form.value.latitude, this.form.value.longitude],
      "photo": this.profile
    }

    this.userService.signup(params).subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.success === true) {
          this.notification.open("Thank you for Signing Up!", "", {
            horizontalPosition: 'end',
            verticalPosition: 'top', duration: 3 * 1000
          })
          this.signup = false;
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
      }
    })
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPwdError() {
    if (this.form.value.password != this.form.value.confirmPassword) {
      return 'Password Mismatch!';
    }

    return this.email.hasError('passwordTyped') ? 'Wrong Passowrd' : '';
  }

  uploadPhoto(event: any) {
    const file: File = event.target.files[0];

    if (file) {

      const formData = new FormData();
      formData.append("photos", file);

      this.userService.uploadPhoto(formData).subscribe({
        next: (res) => {
          console.log("res ==>", res);

          if (res.success === true) {
            this.profile = res.data.result[0];
          } else {
            this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
          }
        },
        error: (e) => {
          this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
        }
      })
    }
  }

  getGeoLocation() {
    console.log('Getting address: ', this.form.value.address);
    this.userService.getLocation(this.form.value.address ? this.form.value.address : "52557").subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.status == 'OK') {
          this.form.setValue({
            firstname: this.form.value.firstname ? this.form.value.firstname : '',
            lastname: this.form.value.lastname ? this.form.value.lastname : '',
            email: this.form.value.email ? this.form.value.email : '',
            password: this.form.value.password ? this.form.value.password : '',
            confirmPassword: this.form.value.confirmPassword ? this.form.value.confirmPassword : '',
            latitude: res.results[0].geometry.location.lat,
            longitude: res.results[0].geometry.location.lng,
            bio: this.form.value.bio ? this.form.value.bio : '',
            profiles: this.form.value.profiles ? this.form.value.profiles : '',
            address: this.form.value.address ? this.form.value.address : ''
          })
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
      }
    })
  }

}
