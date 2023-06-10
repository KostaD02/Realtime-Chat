import { Component } from '@angular/core';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'real-time-chat';

  constructor(private authService: AuthService) {}

  public authState = this.authService.authState;

  logOut() {
    this.authService.logOut();
  }
}
