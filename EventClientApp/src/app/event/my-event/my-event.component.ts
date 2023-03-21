import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import IEvent from 'src/app/IEvent.interface';
import ISimpleDialog from 'src/app/ISimpleDialog.interface';
import { SimpleDailogComponent } from 'src/app/simple-dailog/simple-dailog.component';
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
  isDeleteable = false;

  eventService = inject(EventService);
  userService = inject(UserService);
  notification = inject(MatSnackBar);
  dialog = inject(MatDialog);

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.isEditable = true
    this.isDeleteable = true;
    this.getAllEvents({ registered: false });
  }

  onGroupChange(value: string) {
    // Clear current list 
    this.items = []

    switch (value) {
      case 'my-event':
        this.isEditable = true;
        this.isDeleteable = true;
        this.getAllEvents({
          registered: false
        });
        break;

      case 'reserved-event':
        this.isEditable = false;
        this.isDeleteable = false;
        this.getAllEvents({
          registered: true
        });
        break;

        case 'upcoming':
        this.isEditable = false;
        this.isDeleteable = false;
        this.getAllEvents({
          registered: true,
          startBefore: Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days
        });
    }
  }

  onStartDateValueChange(value: Date) {
    this.startBefore = value.getTime()
  }

  getAllEvents(query: any) {

    // Filter startAt
    if (this.startBefore !== 0 && !query.startBefore) {
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
    switch (type) {
      case 'register':
        this.onRsvp(event)
        break;

      case 'unregister':
        this.onUnrsvp(event)
        break;

      case 'edit':
        this.edit(event)
        break;

      case 'attendees':
        this.onShowAttendees(event)
        break;

        case 'delete': 
        this.delete(event);
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
    this.router.navigate(['', 'event', 'update']);
  }

  onShowAttendees(event: IEvent) {
    this.eventService.attendees = event.attendees;
    this.router.navigate(['', 'event', 'attendees']);
  }

  delete(event: IEvent) {
    const data: ISimpleDialog = {
      title: 'Delete current event',
      message: 'Are you sure want to delete this event?',
      okButton: 'DELETE',
      cancelButton: 'Cancel'
    }
    const dialogRef = this.dialog.open(SimpleDailogComponent, {
      width: '500px',
      data: data
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onConfirmDelete(event);
      }
    })
  }

  onConfirmDelete(event: IEvent) {
    this.eventService.delete(event._id).subscribe({
      next: (res) => {
        if (res.success == true) {
          // remove object from list 
          this.items = this.items.filter(e => e._id !== event._id);
          console.log(this.items);
          this.notification.open('Your event is deleted successfully', 'Dismiss', { duration: 3000 })  
        } else {
          this.notification.open(res.message, 'Dismiss', { duration: 3000 })  
        }
        
      },
      error: (e) => { 
        this.notification.open(e.message, 'Dismiss', { duration: 3000 })
      }
    })
  }

}
