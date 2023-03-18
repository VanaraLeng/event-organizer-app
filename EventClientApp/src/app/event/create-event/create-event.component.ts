import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  isLinear = true;
  firstFormGroup = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: [''],
    longitude: [''],
    seatLimit: ['', Validators.max(100)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });
}
