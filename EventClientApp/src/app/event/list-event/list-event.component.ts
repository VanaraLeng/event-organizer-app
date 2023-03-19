import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent {
  eventService = inject(EventService);
  notification = inject(MatSnackBar);
  ngOnInit() {

    this.eventService.getEvents({ registered: false }).subscribe({
      next: (res) => {
        if (res.success === true) {
          console.log("res ==>", res);
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
