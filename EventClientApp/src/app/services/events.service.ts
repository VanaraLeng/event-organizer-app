import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IResult from './../IResult.interface';
import IStateEvent from './../IState-event.interface';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private client = inject(HttpClient)

  state$ = new BehaviorSubject<IStateEvent>(this.emptyState())
  constructor() { }

  private emptyState(): IStateEvent {
    return {
      _id: '',
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      seatLimit: 0,
      location: [],
      token: '',
    }
  }

  create(event: any) {
    return this.client.post<IResult<any>>(environment.SERVER_BASE_URL + '/api/events', event);
  }
}
