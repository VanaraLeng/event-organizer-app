import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CreateEventComponent } from './create-event/create-event.component';

import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatTableModule } from '@angular/material/table' 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UpdateEventComponent } from './update-event/update-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { MyEventComponent } from './my-event/my-event.component';
import { UserService } from '../user.service';
import { AttendeesComponent } from './attendees/attendees.component';

const guardNonLoggedInUser = () => { 
  const canActivate = inject(UserService).isLoggedIn()
  if (!canActivate) {
    inject(Router).navigate(['','event']);
  }
  return inject(UserService).isLoggedIn() 
}

@NgModule({
  declarations: [
    HomeComponent,
    CreateEventComponent,
    EventCardComponent,
    UpdateEventComponent,
    ViewEventComponent,
    MyEventComponent,
    AttendeesComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'me', component: MyEventComponent, canActivate: [ guardNonLoggedInUser ] },
      { path: 'create', component: CreateEventComponent, canActivate: [ guardNonLoggedInUser ] },
      { path: 'update', component: UpdateEventComponent, canActivate: [ guardNonLoggedInUser ] },
      { path: 'attendees', component: AttendeesComponent, canActivate: [ guardNonLoggedInUser ]},
      { path: '**', redirectTo: '/event' }
    ]),
  ]
})
export class EventModule { }
