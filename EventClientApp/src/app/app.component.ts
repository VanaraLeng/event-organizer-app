import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SimpleDailogComponent } from './simple-dailog/simple-dailog.component';
import ISimpleDialog from './models/ISimpleDialog.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  userService = inject(UserService);
  dialog = inject(MatDialog);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) { }

  logout() {
    const data: ISimpleDialog = {
      title: 'Log out your account',
      message: 'Are you sure want to logout your account?',
      okButton: 'LOG OUT',
      cancelButton: 'Cancel'
    }

    const dialogRef = this.dialog.open(SimpleDailogComponent, {
      width: '400px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.onConfirmDialog(result)
    })
  }

  onConfirmDialog(value: boolean) {
    if (value) {
      this.userService.logout();
      this.router.navigate(['', 'auth', 'login']);
    }
  }

  login() {
    // handle login flow
    console.log('Login')
    this.router.navigate(['', 'auth', 'login']);
  }

  viewProfile() {
    const id = this.userService.state$.getValue()._id;
    this.router.navigate(['', 'user', id]);
  }
}