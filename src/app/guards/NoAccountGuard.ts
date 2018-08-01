import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/AuthService';
import { Router } from '@angular/router';

@Injectable()
export class NoAccountGuard implements CanActivate {

    constructor(private auth_service: AuthService, private router: Router) {}

    canActivate() {
        if (!this.auth_service.isAuthenticated()) {
            this.auth_service.loadSessionFromStorage();
        }
        
        if (!this.auth_service.isAuthenticated()) {
            this.auth_service.loadSession();
        }

        if (this.auth_service.isAuthenticated() && (this.router.url == '' || this.router.url.toLowerCase() == '/login')) {
            this.router.navigate(['home']);
        }
        
        return true;
    }
}