import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent {
  isLinear = true;
  firstFormGroup = inject(FormBuilder).group({
    title: ['AAAA', Validators.required],
    description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'],
    startDate: [new Date, Validators.required],
    endDate: [new Date, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: ['-91.96503407920258'],
    longitude: ['41.01295385898321'],
    seatLimit: ['20', Validators.max(100000)],
    address: ['']
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });

  eventService = inject(EventService);
  userService = inject(UserService);
  notification = inject(MatSnackBar);

  id = this.eventService.editEvent?._id ? this.eventService.editEvent?._id : ''
  columns = 2;
  profile = []
  localUrl = ''
  photoBaseUrl = environment.PHOTO_BASE_URL

  constructor(private router: Router, private _location: Location) { }

  ngOnInit() {
    this.id = this.eventService.editEvent?._id ? this.eventService.editEvent?._id : "null"
    this.eventService.getEventById(this.id).subscribe({
      next: (res) => {
        if (res.success === true) {
          const event = res.data.events[0];
          let startHours = new Date(event.startAt).getHours() < 10 ? "0" + new Date(event.startAt).getHours() : new Date(event.startAt).getHours();
          let endHours = new Date(event.endAt).getHours() < 10 ? "0" + new Date(event.endAt).getHours() : new Date(event.endAt).getHours();
          let startMinutes = new Date(event.startAt).getMinutes() < 10 ? "0" + new Date(event.startAt).getMinutes() : new Date(event.startAt).getMinutes();
          let endMinutes = new Date(event.endAt).getMinutes() < 10 ? "0" + new Date(event.endAt).getMinutes() : new Date(event.endAt).getMinutes();
          this.firstFormGroup.setValue({
            title: event.title,
            description: event.description,
            startDate: new Date(event.startAt),
            endDate: new Date(event.endAt),
            startTime: startHours + ":" + startMinutes,
            endTime: endHours + ":" + endMinutes
          })
          this.secondFormGroup.setValue({
            latitude: event.location[0],
            longitude: event.location[1],
            seatLimit: event.seatLimit,
            address: ""
          })
          this.thirdFormGroup.value.photo = event.photo;
          this.localUrl = event.photo?.filename
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
          this.router.navigate(['', 'event', 'me']);
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
        this.router.navigate(['', 'event', 'me']);
      }
    })

  }

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

    this.eventService.update(params, this.id).subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.success === true) {
          this.notification.open("Thank you for updating event!", "", {
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
      formData.append("photo", file);
      this.userService.uploadPhoto(formData).subscribe({
        next: (res) => {
          if (res.success === true) {
            this.profile = res.data.result;
            var reader = new FileReader();
            reader.onload = (event: any) => {
              this.localUrl = res.data.result;
            }
            reader.readAsDataURL(event.target.files[0]);
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

  goback() {
    this._location.back();
  }
}