import { Component, EventEmitter, Input, Output } from '@angular/core';
import IEvent from 'src/app/IEvent.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'event-card',
  templateUrl: 'event-card.component.html',
  styleUrls: [ 'event-card.component.css']
})
export class EventCardComponent {
  @Input() event!: IEvent
  @Input() editable = false
  @Input() registerable = false
  @Input() deleteable = false

  @Output() action = new EventEmitter<string>()

  basePhotoPath= environment.PHOTO_BASE_URL

  eventAction(type: string) {
    this.action.emit(type)
  }

}
