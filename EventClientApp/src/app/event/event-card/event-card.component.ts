import { Component, EventEmitter, Input, Output } from '@angular/core';
import IEvent from 'src/app/IEvent.interface';

@Component({
  selector: 'event-card',
  templateUrl: 'event-card.component.html',
  styleUrls: [ 'event-card.component.css']
})
export class EventCardComponent {
  @Input() event!: IEvent
  @Output() onRsvp = new EventEmitter<{ _id: string}>()
  @Output() onUnrsvp = new EventEmitter<{ _id: string}>()

  unregister() {
    this.onUnrsvp.emit({ _id:  this.event._id })
  }

  register() {
    this.onRsvp.emit({ _id:  this.event._id })
  }
}
