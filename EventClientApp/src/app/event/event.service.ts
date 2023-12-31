import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { environment } from 'src/environments/environment';
import IEvent from '../models/IEvent.interface';
import IResult from '../models/IResult.interface';
import { IUser } from '../models/IUser.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private client = inject(HttpClient)

  editEvent?: IEvent
  attendees?: IUser[]

  constructor(private router: Router, private urlSerializer: UrlSerializer) { }

  getEvents(query: any) {
    // Construct query
    const urlTree = this.router.createUrlTree(['/'], { queryParams: query })
    let queryString = this.urlSerializer.serialize(urlTree);
    queryString = queryString.replace('/', '');
    return this.client.get<IResult<{ events: IEvent[] }>>(environment.SERVER_BASE_URL + '/api/events' + queryString);
  }

  register(event_id: string, action: string) {
    return this.client.post<IResult<{ result: any }>>(environment.SERVER_BASE_URL + '/api/events/' + event_id + '/registration?action=' + action, {});
  }

  create(event: any) {
    return this.client.post<IResult<any>>(environment.SERVER_BASE_URL + '/api/events', event);
  }

  getEventById(id: string) {
    return this.client.get<IResult<any>>(environment.SERVER_BASE_URL + '/api/events/' + id);
  }

  update(event: any, id: string) {
    return this.client.put<IResult<any>>(environment.SERVER_BASE_URL + '/api/events/' + id, event);
  }

  delete(id: string) {
    return this.client.delete<IResult<any>>(environment.SERVER_BASE_URL + '/api/events/' + id);
  }
}