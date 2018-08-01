import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/AuthService';
import { Router } from '@angular/router';

@Injectable()
export class GuestGuard implements CanActivate {

    constructor(private auth_service: AuthService, private router: Router) {}

    canActivate() {
        if (!this.auth_service.isAuthenticated()) {
            this.auth_service.loadSession();
        }
        
        var can_activate = this.auth_service.isAuthenticated() && this.auth_service.getAccount().isGuest();
        
        if (!can_activate) {
            this.router.navigate(['login']);
        }
        
        return can_activate;
    }
}