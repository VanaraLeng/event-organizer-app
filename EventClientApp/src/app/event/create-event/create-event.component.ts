import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  isLinear = true;
  // firstFormGroup = inject(FormBuilder).group({
  //   title: ['', Validators.required],
  //   description: [''],
  //   startDate: ['', Validators.required],
  //   endDate: ['', Validators.required]
  // });
  // secondFormGroup = inject(FormBuilder).group({
  //   latitude: [''],
  //   longitude: [''],
  //   seatLimit: ['', Validators.max(100)]
  // });
  firstFormGroup = inject(FormBuilder).group({
    title: ['AAAA', Validators.required],
    description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: ['-91.96503407920258'],
    longitude: ['41.01295385898321'],
    seatLimit: ['20', Validators.max(100)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });

  eventService = inject(EventsService);
  notification = inject(MatSnackBar);

  onSubmit() {
    const params = {
      "title": this.firstFormGroup.value.title,
      "description": this.firstFormGroup.value.description,
      "startAt": this.firstFormGroup.value.startDate,
      "endAt": this.firstFormGroup.value.endDate,
      "location": [this.secondFormGroup.value.latitude, this.secondFormGroup.value.longitude],
      "seatLimit": this.secondFormGroup.value.seatLimit
    }

    this.eventService.create(params).subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.success === true) {
          this.notification.open("Thank you for creating event!", "", {
            horizontalPosition: 'end',
            verticalPosition: 'top', duration: 3 * 1000
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
