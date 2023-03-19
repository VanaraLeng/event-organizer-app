import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CreateEventComponent } from './create-event/create-event.component';

import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UpdateEventComponent } from './update-event/update-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { ViewEventComponent } from './view-event/view-event.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreateEventComponent,
    EventCardComponent,
    UpdateEventComponent,
    ListEventComponent,
    ViewEventComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'create', component: CreateEventComponent },
      { path: 'update', component: UpdateEventComponent },
      { path: '**', redirectTo: '' }
    ])
  ]
})
export class EventModule { }
