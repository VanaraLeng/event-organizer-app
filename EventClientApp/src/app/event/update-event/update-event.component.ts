import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent {
  isLinear = true;
  firstFormGroup = inject(FormBuilder).group({
    title: ['AAAA', Validators.required],
    description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });
  secondFormGroup = inject(FormBuilder).group({
    latitude: ['-91.96503407920258'],
    longitude: ['41.01295385898321'],
    seatLimit: ['20', Validators.max(100)]
  });
  thirdFormGroup = inject(FormBuilder).group({
    photo: ['']
  });
}
