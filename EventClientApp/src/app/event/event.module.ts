import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';

import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateEventComponent } from './update-event/update-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { ListEventComponent } from './list-event/list-event.component';

@NgModule({
  declarations: [
    CreateEventComponent,
    UpdateEventComponent,
    ViewEventComponent,
    ListEventComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'create', component: CreateEventComponent },
      { path: 'update', component: UpdateEventComponent },
      { path: 'list', component: ListEventComponent },
      { path: 'view', component: ViewEventComponent },
    ])
  ]
})
export class EventModule { }
