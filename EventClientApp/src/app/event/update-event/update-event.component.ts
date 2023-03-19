import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';

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
    endDate: [new Date, Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: ['-91.96503407920258'],
    longitude: ['41.01295385898321'],
    seatLimit: ['20', Validators.max(100)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });

  eventService = inject(EventService);
  notification = inject(MatSnackBar);

  id = "64172faccd326f6acbb02c8b"

  ngOnInit() {

    this.eventService.getEventById(this.id).subscribe({
      next: (res) => {
        if (res.success === true) {
          console.log("res ==>", res);
          const event = res.data.events[0];
          this.firstFormGroup.setValue({
            title: event.title,
            description: event.description,
            startDate: new Date(event.startAt),
            endDate: new Date(event.endAt)
          })
          this.secondFormGroup.setValue({
            latitude: event.location[0],
            longitude: event.location[1],
            seatLimit: event.seatLimit
          })
          this.thirdFormGroup.value.photo = event.photo;
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3 * 1000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3 * 1000 })
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
      "seatLimit": this.secondFormGroup.value.seatLimit
    }

    this.eventService.update(params, this.id).subscribe({
      next: (res) => {
        console.log("res ==>", res);

        if (res.success === true) {
          this.notification.open("Thank you for updating event!", "", {
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