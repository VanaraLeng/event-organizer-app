import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { UserService } from '../../user.service';
import { Location } from '@angular/common';

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
    endDate: [new Date, Validators.required],
    startTime: ['10:00', Validators.required],
    endTime: ['15:00', Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: [''],
    longitude: [''],
    address: ['52557'],
    seatLimit: ['', Validators.max(100000)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });

  eventService = inject(EventService);
  userService = inject(UserService);
  notification = inject(MatSnackBar);

  columns: number = 2;
  linear = true;
  profile = []
  localUrl = []

  constructor(private router: Router, private _location: Location) { }

  starttime() {
    this.firstFormGroup.setValue({
      title: this.firstFormGroup.value.title ? this.firstFormGroup.value.title : "",
      description: this.firstFormGroup.value.description ? this.firstFormGroup.value.description : "",
      startDate: this.setDateTime(this.firstFormGroup.value.startDate, this.firstFormGroup.value.startTime),
      endDate: this.firstFormGroup.value.endDate ? this.firstFormGroup.value.endDate : new Date,
      startTime: this.firstFormGroup.value.startTime ? this.firstFormGroup.value.startTime : "",
      endTime: this.firstFormGroup.value.endTime ? this.firstFormGroup.value.endTime : ""
    });
  }

  endtime() {
    this.firstFormGroup.setValue({
      title: this.firstFormGroup.value.title ? this.firstFormGroup.value.title : "",
      description: this.firstFormGroup.value.description ? this.firstFormGroup.value.description : "",
      startDate: this.firstFormGroup.value.startDate ? this.firstFormGroup.value.startDate : new Date,
      endDate: this.setDateTime(this.firstFormGroup.value.endDate, this.firstFormGroup.value.endTime),
      startTime: this.firstFormGroup.value.startTime ? this.firstFormGroup.value.startTime : "",
      endTime: this.firstFormGroup.value.endTime ? this.firstFormGroup.value.endTime : ""
    });
  }

  setDateTime(date: any, time: any) {
    let timesArr = time.split(":");
    let hours = parseInt(timesArr[0]);
    let minutes = parseInt(timesArr[1]);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date;
  }

  onSubmit() {
    const params = {
      "title": this.firstFormGroup.value.title,
      "description": this.firstFormGroup.value.description,
      "startAt": new Date(this.firstFormGroup.value.startDate ? this.firstFormGroup.value.startDate : '').getTime(),
      "endAt": new Date(this.firstFormGroup.value.endDate ? this.firstFormGroup.value.endDate : '').getTime(),
      "location": [this.secondFormGroup.value.latitude, this.secondFormGroup.value.longitude],
      "seatLimit": this.secondFormGroup.value.seatLimit,
      "photo": this.profile
    }

    console.log(params);

    this.eventService.create(params).subscribe({
      next: (res) => {
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
    this.userService.getLocation(this.secondFormGroup.value.address ? this.secondFormGroup.value.address : "52557").subscribe({
      next: (res) => {
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
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      const formData = new FormData();
      formData.append("photo", file);

      this.userService.uploadPhoto(formData).subscribe({
        next: (res) => {
          if (res.success === true) {
            this.profile = res.data.result;
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
  
  goback() {
    this._location.back();
  }
}
