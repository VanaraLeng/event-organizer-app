import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IResult from './IResult.interface';
import IState from './IState.interface';
import  {environment} from '../environments/environment'

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
    return this.client.post<IResult<{ token: string }>>( environment.SERVER_BASE_URL + '/api/users/login', user);
  }

  logout() {
    this.state$.next(this.emptyState());
    localStorage.setItem('APPSTATE', '');
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
