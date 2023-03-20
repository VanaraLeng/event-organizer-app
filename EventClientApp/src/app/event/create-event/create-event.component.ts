import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  firstFormGroup = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: [''],
    startDate: [new Date, Validators.required],
    endDate: [new Date, Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: [''],
    longitude: [''],
    address: ['52557'],
    seatLimit: ['', Validators.max(100)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });

  eventService = inject(EventService);
  userService = inject(UserService);
  notification = inject(MatSnackBar);

  columns: number = 2;
  linear = true;
  profile: string[] = []

  constructor(private router: Router) { }

  onSubmit() {
    const params = {
      "title": this.firstFormGroup.value.title,
      "description": this.firstFormGroup.value.description,
      "startAt": this.firstFormGroup.value.startDate?.getTime(),
      "endAt": this.firstFormGroup.value.endDate?.getTime(),
      "location": [this.secondFormGroup.value.latitude, this.secondFormGroup.value.longitude],
      "seatLimit": this.secondFormGroup.value.seatLimit,
      "photo": this.profile
    }

    this.eventService.create(params).subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.success === true) {
          // this.notification.open("Thank you for creating event!", "", {
          //   horizontalPosition: 'end',
          //   verticalPosition: 'top', duration: 3 * 1000
          // })
          this.notification.open("Thank you for creating event!", "", {
            duration: 3 * 1000
          })
          this.router.navigate(['', 'event', 'me']);
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
      }
    })
  }

  getGeoLocation() {
    console.log('Getting address: ', this.secondFormGroup.value.address);
    this.userService.getLocation(this.secondFormGroup.value.address ? this.secondFormGroup.value.address : "52557").subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.status == 'OK') {
          this.secondFormGroup.setValue({
            latitude: res.results[0].geometry.location.lat,
            longitude: res.results[0].geometry.location.lng,
            seatLimit: this.secondFormGroup.value.seatLimit ? this.secondFormGroup.value.seatLimit : '',
            address: this.secondFormGroup.value.address ? this.secondFormGroup.value.address : '',
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

  breakPoints() {
    switch (true) {
      case (window.innerWidth <= 480):
        this.columns = 1;
        break;
      case (window.innerWidth > 480 && window.innerWidth <= 640):
        this.columns = 1;
        break;
      case (window.innerWidth > 640 && window.innerWidth <= 992):
        this.columns = 2;
        break;
      default:
        this.columns = 2;
    }
  }

  onResize(event: any) {
    this.breakPoints();
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
            this.profile.push(...this.profile, res.data.result[0]);
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
