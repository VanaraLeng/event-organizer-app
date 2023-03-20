import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import IEvent from 'src/app/IEvent.interface';
import { UserService } from 'src/app/user.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent {
  items: IEvent[] = []

  sorted?: string
  eventService = inject(EventService);
  userService = inject(UserService);

  notification = inject(MatSnackBar);

  startBefore?: number;

  constructor(private router: Router) {

  }

  ngAfterViewInit() {
    this.getAllEvents({});
  }

  onSortButtonGroupValChange(value: string) {
    // Clear current list 
    this.items = []

    const location = this.userService.state$.value.location;
    this.sorted = value

    switch (value) {
      case 'recommend':
        
        this.getAllEvents({});
        break;

      case 'popular':
        this.getAllEvents({
          popular: true
        });
        break;

      case 'nearby': {
        this.getAllEvents({
          lat: location[0] ?? 0,
          long: location[1] ?? 0,
        });
      }
    }
  }

  onStartDateValueChange(value: Date) {
    this.startBefore = value.getTime() / 1000
    const sort = this.sorted ?? "recommend";
    this.onSortButtonGroupValChange(sort)
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
        this.notification.open(e.message, 'Dismiss')
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

      case 'attendees':
        this.onShowAttendees(event)
        break;
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

  onShowAttendees(event: IEvent) {
    this.eventService.attendees = event.attendees;
    this.router.navigate(['', 'event', 'attendees']);
  }

}
