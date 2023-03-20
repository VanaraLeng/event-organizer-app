import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import ISimpleDialog from '../ISimpleDialog.interface';

@Component({
  selector: 'app-simple-dailog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      {{ data.message }}
    </div>
    <div mat-dialog-actions>
      <span class="spacer"> </span>
      <button mat-stroked-button mat-dialog-close cdkFocusInitial *ngIf="data.cancelButton as cancelButton" (click)="pressButton(false)">{{cancelButton}}</button>
      <button mat-flat-button mat-dialog-close color="warn" *ngIf="data.okButton as okButton" (click)="pressButton(true)">{{okButton}}</button>
    </div>
  `,
  styles: [`
    button {
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `
  ]
})
export class SimpleDailogComponent {

  pressButton(value: boolean) {
    this.dialogRef.close(value);
  }

  constructor(public dialogRef: MatDialogRef<SimpleDailogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ISimpleDialog) {

  }

}
