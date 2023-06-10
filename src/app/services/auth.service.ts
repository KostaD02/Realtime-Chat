import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { tap } from 'rxjs';

export enum UserAuthType {
  Google = "google",
  Anonymous = "anonymous"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private alertService: AlertService
  ) {
    this.authState.pipe(
      tap(result => {
        console.log(result);
      })
    ).subscribe();
  }

  get authState() {
    return this.fireAuth.authState;
  }

  public googleSignIn() {
    this.fireAuth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      if (res.user) {
        this.handleUserAuth();
      }
    }).catch(err => {
      this.handleError(err);
    });
  }

  public anonymousSignIn() {
    this.fireAuth.signInAnonymously().then(res => {
      if (res.user) {
        this.handleUserAuth();
      }
    }).catch(err => {
      this.handleError(err);
    });
  }

  private handleUserAuth() {
    this.alertService.displayToast("Authorized", "success", "green");
    this.router.navigateByUrl("/");
  }

  private handleError(err: Error) {
    const code = err.message.split(".")[2].replace(")", "").split("/").pop() || "";
    switch(code) {
      case "popup-blocked": {
        this.alertService.displayToast("Popup blocked", "error", "red", 3000);
        break;
      }
      default: {
        this.alertService.displayToast("Popup Closed", "error", "red", 3000);
        break;
      }
    }
  }

  public logOut() {
    this.fireAuth.signOut().then(() => {
      this.alertService.displayToast("Successfully log out", "success", "green");
      this.router.navigateByUrl('/auth');
    }, err => {
      console.log(err);
    });
  }
}
