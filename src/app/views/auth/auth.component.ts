import { Component } from '@angular/core';
import { AlertService, AuthService, UserAuthType } from 'src/app/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public UserAuthType = UserAuthType;

  constructor(private authService: AuthService, private alertService: AlertService) {}

  signIn(method: UserAuthType) {
    switch(method) {
      case UserAuthType.Google: {
        this.authService.googleSignIn();
        break;
      }
      case UserAuthType.Anonymous: {
        this.authService.anonymousSignIn();
        break;
      }
      default: {
        this.alertService.displayToast("No auth provided", "error", "red");
        break;
      }
    }
  }
}
