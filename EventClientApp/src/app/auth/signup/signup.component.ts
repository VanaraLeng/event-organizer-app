import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';

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
    location: [{
      lat: '',
      long: ''
    }],
    bio: [''],
    profile: [''],
  })
  email = new FormControl('', [Validators.required, Validators.email]);

  userService = inject(UserService);
  notification = inject(MatSnackBar);
  router = inject(Router)

  onSubmit() {
    const param = this.form.value
    this.notification.open("Thank you for Signing Up!", "", {
      horizontalPosition: 'end',
      verticalPosition: 'top', duration: 3 * 1000
    })
    // this.userService.signup(param).subscribe({
    //   next: (res) => {
    //     if (res.success === true) {
    //       console.log("sign up success");
    //     } else {
    //       this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
    //     }
    //   },
    //   error: (e) => {
    //     this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
    //   }
    // })
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
