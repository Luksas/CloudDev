import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import {MyResponse} from '../../data/MyResponse';

@Component({
    selector: 'LoginComponent',
    templateUrl: './LoginComponent.html',
    styles: [
    `
        .forgot-password {
            text-decoration: underline;
            color: #888;
        }       
        .forgot-password:hover,
        .forgot-password:focus {
            text-decoration: underline;
            color: #666;
        }
    `
    ]
})

export class LoginComponent {
    
    authentication_error: string = "";
    username: string = "";
    password: string = "";
    
    constructor(private auth_service: AuthService, private router: Router) {}
    
    login(){
        this.auth_service.login(this.username, this.password, (response: MyResponse) => {
            if (!response.hasErrors()) {
                this.authentication_error = "";
                this.router.navigate(['home']);
            }
            
            this.authentication_error = response.error.toString();
        });
    }
    
    showError(){
        return this.authentication_error != "";
    }
    
};