import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
    selector: 'LogoutComponent',
    template: `
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-heading">
                        {{ 'ARE_YOU_SURE_YOU_WANNA_LOGOUT' | translate }}
                    </div>

                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-offset-3 col-md-6">
                                <input class="btn btn-block btn-primary" type="button" value="{{ 'LOGOUT' | translate }}" (click)="logout()" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class LogoutComponent implements OnInit {
    
    constructor(private auth_service: AuthService, private router: Router) {}
    
    ngOnInit(){}
    
    logout(){
        this.auth_service.logout().subscribe(() => {
            this.router.navigate(['login']);
        });
    }
};