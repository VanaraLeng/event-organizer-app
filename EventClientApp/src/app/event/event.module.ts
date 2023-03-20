import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CreateEventComponent } from './create-event/create-event.component';

import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatTableModule } from '@angular/material/table' 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UpdateEventComponent } from './update-event/update-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { MyEventComponent } from './my-event/my-event.component';
import { UserService } from '../user.service';
import { AttendeesComponent } from './attendees/attendees.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreateEventComponent,
    EventCardComponent,
    UpdateEventComponent,
    ListEventComponent,
    ViewEventComponent,
    MyEventComponent,
    AttendeesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'me', component: MyEventComponent, canActivate: [() => { return inject(UserService).isLoggedIn() }] },
      { path: 'create', component: CreateEventComponent },
      { path: 'update', component: UpdateEventComponent },
      { path: 'list', component: ListEventComponent },
      { path: 'attendees', component: AttendeesComponent},
      { path: '**', redirectTo: '' }
    ])
  ]
})
export class EventModule { }
