import { Component } from '@angular/core';
import { IUser } from 'src/app/IUser.interface';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css'],
})
export class AttendeesComponent {
  attendees: IUser[] = [
    {
      _id: "6414ce6eaf585aaa0f48c736",
      firstName: "john",
      lastName: "wick",
      email: "john.wick@gmail.com",
      password: "$2b$10$sqSmi6n//DzJ2mtHfNLuw.9oJHWcLhHm6S8LgXtQCGS3xeOqX79b6",
      bio: "this is john wick!!",
      location: [],      
      photo: {
        filename: "profile.jpg",
        _id: "64178c799135ea7a8a99aad5"
      }
    },
    {
      _id: "6414ce6eaf585aaa0f48c736",
      firstName: "john",
      lastName: "wick",
      email: "john.wick@gmail.com",
      password: "$2b$10$sqSmi6n//DzJ2mtHfNLuw.9oJHWcLhHm6S8LgXtQCGS3xeOqX79b6",
      bio: "this is john wick!!",
      location: [],      
      photo: {
        filename: "profile.jpg",
        _id: "64178c799135ea7a8a99aad5"
      }
    },
  ];

  displayedColumns: string[] = ['order', 'firstName', 'lastName', 'email'];
  dataSource: object[] = [];

  constructor() {
    let order = 1;
    this.attendees.forEach(attendee => {
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
