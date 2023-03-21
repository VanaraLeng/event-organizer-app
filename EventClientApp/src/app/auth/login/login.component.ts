import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';
import jwt_decode from 'jwt-decode';
import IState from 'src/app/IState.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required] ]
  })

  userService = inject(UserService);
  notification = inject(MatSnackBar);
  router = inject(Router)

  get email() { return this.form.get('email') as FormControl }
  get password() { return this.form.get('password') as FormControl }

  paswordHidden = true;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login() {
    // Some browser may remove disabled directive
    if (this.form.invalid) {
      this.notification.open('Please enter correct input.');
      return;
    }

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
