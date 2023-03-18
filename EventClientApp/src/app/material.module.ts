import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card'

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';

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
    ],
    providers: [
      {provide: MatCardModule}
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
    ]

})
export class MaterialModule { }