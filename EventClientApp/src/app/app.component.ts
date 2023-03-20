import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar> Menu</mat-toolbar>
        
        <mat-nav-list>
          <a mat-list-item [routerLink]="['','event']" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}"> Public Events </a>
          <a mat-list-item [routerLink]="['','event', 'me']" routerLinkActive="active-link">My Events</a>
          <mat-divider/>
            <a mat-list-item *ngIf="userService.isLoggedIn()" (click)='logout()' color="accent"> Log Out </a>
            <a mat-list-item  *ngIf="!userService.isLoggedIn()" (click)='login()' color="accent"> Log In / Join </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <mat-icon>book_online</mat-icon> 
          <span class="hspace">  </span>
          <span> Eventizer</span>
          <span class="example-spacer"></span>

          <button mat-fab extended *ngIf="userService.isLoggedIn()" (click)="viewProfile()"> 
            <mat-icon>account_circle</mat-icon>
            {{ userService.state$.value.firstName | titlecase }} {{ userService.state$.value.lastName | titlecase }}
          </button>
        </mat-toolbar>
        
        <!-- Add Content Here -->
        <router-outlet></router-outlet>

      </mat-sidenav-content>
    </mat-sidenav-container>
    
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    
    .sidenav {
      width: 200px;
    }
    
    .sidenav .mat-toolbar {
      background: inherit;
    }
    
    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .example-spacer {
      flex: 1 1 auto;
    }

    .active-link {
      background-color: lightgrey;
    }

    .hspace {
      width: 12px;
    }
    
  `]
})
export class AppComponent {
  userService = inject(UserService);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) {}

  logout() {
    // handle logout flow
    console.log('Logout')
    this.userService.logout();
    this.router.navigate(['','auth','login']);
  }

  login() {
    // handle login flow
    console.log('Login')
    this.router.navigate(['','auth','login']);
  }

  viewProfile() {
    const id = this.userService.state$.getValue()._id;
    this.router.navigate(['', 'user', id]);
  }
}