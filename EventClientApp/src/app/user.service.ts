import { HttpClient, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IResult from './IResult.interface';
import IState from './IState.interface';
import { environment } from '../environments/environment'
import { Users } from "./models/User";
import { IUser } from './IUser.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private client = inject(HttpClient)

  state$ = new BehaviorSubject<IState>(this.emptyState())

  constructor() { }

  isLoggedIn() {
    const token = this.state$.value.token;
    return token != null && token.length > 0
  }

  login(user: any) {
    return this.client.post<IResult<{ token: string }>>(environment.SERVER_BASE_URL + '/api/users/login', user);
  }

  logout() {
    this.state$.next(this.emptyState());
    localStorage.setItem('APPSTATE', '');
  }

  signup(user: any) {
    return this.client.post<IResult<Users>>(environment.SERVER_BASE_URL + '/api/users/signup', user);
  }

  getUser(_id: string) {
    return this.client.get<IResult<{ user: IUser }>>(environment.SERVER_BASE_URL + '/api/users/' + _id);
  }

  updateUser(_id: string, user: any) {
    return this.client.put<IResult<{ result: any }>>(environment.SERVER_BASE_URL + '/api/users/' + _id, user);
  }

  uploadPhoto(formData: any) {
    // POST http://localhost:3000/api/photos
    return this.client.post<IResult<{ result: any }>>(environment.SERVER_BASE_URL + '/api/photos', formData);
  }

  getLocation(zipcode: string) {
    // POST https://maps.googleapis.com/maps/api/geocode/json?key=YOUR_API_KEY&components=postal_code:97403
    //AIzaSyCF2DzUKXShDYcD14kQO3GbsKF75rBZ0Jo
    return this.client.get<any>('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCF2DzUKXShDYcD14kQO3GbsKF75rBZ0Jo&components=postal_code:' + zipcode);
  }

  // Helper methods
  private emptyState(): IState {
    return {
      _id: '',
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      location: [],
      token: ''
    }
  }
}
