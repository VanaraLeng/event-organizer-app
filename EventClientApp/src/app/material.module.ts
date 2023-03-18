import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card'

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [

    ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatGridListModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    providers: [
        { provide: MatCardModule }
    ],
    bootstrap: [],
    exports: [
        MatCardModule,
        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatGridListModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ]

})
export class MaterialModule { }