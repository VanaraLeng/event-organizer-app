import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import IEvent from 'src/app/IEvent.interface';
import { UserService } from 'src/app/user.service';
import { EventService } from '../event.service';

@Component({
  selector: 'event-my-event',
  templateUrl: 'my-event.component.html',
  styleUrls: ['my-event.component.css'],
})
export class MyEventComponent {
  items: IEvent[] = []
  startBefore?: number;
  isEditable = false

  eventService = inject(EventService);
  userService = inject(UserService);
  notification = inject(MatSnackBar);

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.isEditable = true
    this.getAllEvents({ registered : false });
  }

  onGroupChange(value: string) {
    // Clear current list 
    this.items = []

    switch (value) {
      case 'my-event':
        this.isEditable = true;
        this.getAllEvents({
          registered: false
        });
        break;

      case 'reserved-event':
        this.isEditable = false;
        this.getAllEvents({
          registered: true
        });
        break;
    }
  }

  onStartDateValueChange(value: Date) {
    this.startBefore = value.getTime() / 1000
  }

  getAllEvents(query: any) {

    // Filter startAt
    if (this.startBefore !== 0) {
      query = { ...query, startBefore: this.startBefore }
    }

    this.eventService.getEvents(query).subscribe({
      next: (res) => {
        if (res.success == true) {
          this.items = res.data.events
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss', { duration: 3000 })
      }
    })
  }

  cardEventAction(event: IEvent, type: string) {
    switch(type) {
      case 'register': 
        this.onRsvp(event)
        break;
        
      case 'unregister': 
        this.onUnrsvp(event)
        break;

        case 'edit':
          this.edit(event) 
    }
  }

  onRsvp(event: IEvent) {
    this.eventService.register(event._id, 'register').subscribe({
      next: (res) => {
        if (res.success == true) {
          event.registered = true;
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss')
      }
    })
  }

  onUnrsvp(event: IEvent) {
    this.eventService.register(event._id, 'unregister').subscribe({
      next: (res) => {
        if (res.success == true) {
          event.registered = false;

        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3000 })
        }
      },
      error: (e) => {
        this.notification.open(e.message, 'Dismiss')
      }
    })
  }

  edit(event: IEvent) {
    this.eventService.editEvent = event
    this.router.navigate(['','event','create']);
  }
  
}
