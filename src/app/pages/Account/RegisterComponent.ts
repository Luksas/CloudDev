import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';

@Component({
    selector: 'RegisterComponent',
    templateUrl: './RegisterComponent.html',
})

export class RegisterComponent implements OnInit {
    
    username: string;
    password: string;
    renter_password: string;
    email: string;
    registration_error: string;
    
    constructor(private user_service: UserService, private router: Router) {}
    
    ngOnInit(){
        this.username = "";
        this.password = "";
        this.renter_password = "";
        this.email = "";
    }
    
    register(event: Event){
        this.user_service.register(
            this.username, 
            this.password, 
            this.renter_password,
            this.email
        ).subscribe(response => {
            if (response.hasErrors()) {
                this.registration_error = response.getErrorMessage();
                return;
            }
            
            this.router.navigate(['login']);
        });
    }
    
};