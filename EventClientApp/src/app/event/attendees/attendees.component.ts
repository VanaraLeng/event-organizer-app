import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IUser } from 'src/app/IUser.interface';
import { environment } from 'src/environments/environment';
import { EventService } from '../event.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css'],
})
export class AttendeesComponent {
  attendees?: IUser[] = inject(EventService).attendees;
  photoUrl = environment.PHOTO_BASE_URL;
  displayedColumns: string[] = [ 'order', 'photo', 'firstName', 'lastName', 'email'];
  dataSource: object[] = [];

  constructor(private _location: Location) {
    let order = 1;
    this.attendees?.forEach(attendee => {
      const data = {
        order: order,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        email: attendee.email,
        photo: attendee.photo
      }
      this.dataSource.push(data);
      order++;
    });
    console.log(this.attendees);
  }
  
  goback() {
    this._location.back();
  }
}
