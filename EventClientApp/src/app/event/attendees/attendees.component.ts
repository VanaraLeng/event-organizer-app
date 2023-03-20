import { Component, inject } from '@angular/core';
import { IUser } from 'src/app/IUser.interface';
import { EventService } from '../event.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css'],
})
export class AttendeesComponent {
  attendees?: IUser[] = inject(EventService).attendees;

  displayedColumns: string[] = ['order', 'firstName', 'lastName', 'email'];
  dataSource: object[] = [];

  constructor() {
    let order = 1;
    this.attendees?.forEach(attendee => {
      const data = {
        order: order,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        email: attendee.email
      }
      this.dataSource.push(data);
      order++;
    });
  }
}
