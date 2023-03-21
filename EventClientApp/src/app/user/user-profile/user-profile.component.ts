import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/IUser.interface';
import { UserService } from 'src/app/user.service';
import { environment } from '../../../environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

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
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    bio: '',
    address: [''],
    latitude: ['', [Validators.required]],
    longitude: ['', [Validators.required]],
    photo: ''
  })

  user!: IUser;
  photoUrl!: string;
  photoBaseUrl = environment.PHOTO_BASE_URL
  notification = inject(MatSnackBar);

  isMe = false;

  constructor(private _location: Location) {

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
            latitude: String(this.user.location[0]),
            longitude: String(this.user.location[1]),
            photo: this.user.photo.filename
          })
        }
      });
  }

  profile?: String

  uploadPhoto(event: any) {
    const file: File = event.target.files[0];

    if (file) {

      const formData = new FormData();
      formData.append("photo", file);

      this.userService.uploadPhoto(formData).subscribe({
        next: (res) => {
          console.log("res ==>", res);

          if (res.success === true) {
            const filename = res.data.result
            this.form.value.photo = filename;
            this.user.photo.filename = filename;
            console.log(filename);
            // Mark form as dirty
            this.form.get('photo')?.markAsDirty();

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
            bio: this.form.value.bio ? this.form.value.bio : '',
            address: this.form.value.address ? this.form.value.address : '',
            latitude: res.results[0].geometry.location.lat,
            longitude: res.results[0].geometry.location.lng,
            photo: this.form.value.photo ?? ''
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
    if (!this.form.dirty || this.form.invalid) {
      this.notification.open("Please enter correct information.", 'Dismiss', { duration: 3 * 1000 })
      return
    }

    const formValue = this.form.value;
    const updateUser = {
      firstName: formValue.firstname as string,
      lastName: formValue.lastname as string,
      email: formValue.email as string,
      bio: formValue.bio as string,
      location: [Number(formValue.latitude), Number(formValue.longitude)],
      photo: formValue.photo
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

  goback() {
    this._location.back();
  }
}
