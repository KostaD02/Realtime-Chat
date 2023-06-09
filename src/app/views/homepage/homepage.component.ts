import { Component } from '@angular/core';
import { AlertService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  constructor(private authService: AuthService, private alertService: AlertService) {
  }
}
