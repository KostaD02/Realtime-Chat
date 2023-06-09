import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../services';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnathedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          return this.router.createUrlTree(['/']);
        } else {
          return true;
        }
      })
    );
  }
}