import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
          <a mat-list-item [routerLink]="['','event']">Public Events</a>
          <a mat-list-item [routerLink]="['','auth','login']" href="#">My Events</a>
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
          <span>Eventizer</span>
          <span class="example-spacer"></span>
          <button mat-raised-button  *ngIf="isLogin" (action)='logout()' color="accent"> Log Out </button>
          <button mat-raised-button *ngIf="!isLogin" (action)='login()' color="accent"> Log In </button>
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
    
  `]
})
export class AppComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  isLogin() {
    return false;
  }

  logout() {
    // handle logout flow
  }

  login() {
    // handle login flow
  }

}