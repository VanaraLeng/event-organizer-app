import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center" class="content">
      <h3>{{title}}!</h3>
    </div>

    <router-outlet></router-outlet>
    
  `,
  styles: []
})
export class AppComponent {
  title = 'Eventizer';
}
