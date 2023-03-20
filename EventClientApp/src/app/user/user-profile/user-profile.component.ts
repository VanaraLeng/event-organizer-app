import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/IUser.interface';
import { UserService } from 'src/app/user.service';
import { environment } from '../../../environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);

  form = inject(FormBuilder).group({
    firstname: [''],
    lastname: [''],
    email: ['', [Validators.required, Validators.email]],
    bio: [''],
    address: [''],
    latitude: [''],
    longitude: [''],
  })

  user!: IUser;
  photoUrl!: string;
  notification = inject(MatSnackBar);

  isMe = false;

  constructor() {

    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('user_id') as string),
        mergeMap(user_id => this.userService.getUser(user_id))
      )
      .subscribe({
        next: response => {

          

          this.user = response.data.user as IUser;
          if (this.user.photo) this.photoUrl = environment.PHOTO_BASE_URL + this.user.photo.filename;
          else this.photoUrl = "";

          const myId = this.userService.state$.value._id;
          this.isMe = this.user._id === myId;

          this.form.setValue({
            firstname: this.user.firstName,
            lastname: this.user.lastName,
            email: this.user.email,
            bio: this.user.bio,
            address: '',
            latitude:  String(this.user.location[0]),
            longitude: String(this.user.location[1])
          })
        }
      });
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
            bio: this.form.value.bio ? this.form.value.bio : '',
            address: this.form.value.address ? this.form.value.address : '',
            latitude: res.results[0].geometry.location.lat,
            longitude: res.results[0].geometry.location.lng,
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

  update() {
    if (this.form.dirty) {
      const formValue = this.form.value;
      const updateUser = {
        firstName: formValue.firstname as string,
        lastName: formValue.lastname as string,
        email: formValue.email as string,
        bio: formValue.bio as string,
        location: [ Number(formValue.latitude), Number(formValue.longitude)]
      };
      this.userService.updateUser(this.user._id, updateUser).subscribe({
        next: (res) => {
          console.log("res ==>", res);

          if (res.success === true) {
            this.notification.open("Successfully update profile!", "", { duration: 3 * 1000 })
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
}
