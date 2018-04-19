import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate() {
        if (this.authService.loggedIn()) {
            this.router.navigate(['/']);            
            return false;
        } else {
            return true;
        }
    }
}