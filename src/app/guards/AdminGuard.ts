/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {AuthService} from '../services/AuthService';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private auth_service: AuthService) {}

    canActivate() {
        if (!this.auth_service.isAuthenticated()) {
            this.auth_service.loadSessionFromStorage();
        }
                
        return this.auth_service.isAuthenticated() && this.auth_service.getAccount().isAdmin();
    }
}