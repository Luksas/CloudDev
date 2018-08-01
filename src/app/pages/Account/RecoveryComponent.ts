import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { MyResponse } from '../../data/MyResponse';

@Component({
    selector: 'RecoveryComponent',
    template: `
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-heading">

                        <div class="row">
                            <h2>{{ 'ACCOUNT_RECOVERY' | translate }}</h2>
                        </div>
                    </div>

                    <div class="panel-body">
                        <div *ngIf="showError()" class="row">
                            <div class="col-sm-12">
                                <span class="error-msg">{{ error | translate }}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-12">
                                    {{ 'WELCOME_TO_ACCOUNT_RECOVERY' | translate }}
                                </div>
                            </div>

                            <div class="row">
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    {{ 'EMAIL' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <input type="text" tabindex="1" class="form-control" placeholder="{{ 'EMAIL' | translate }}" [(ngModel)]="email">
                                </div>
                            </div>
                        </div>      

                        <div class="form-group">
                            <div class="row ">
                                <div class="col-sm-6 col-sm-offset-3">
                                    <input type="submit" tabindex="2" class="form-control btn btn-primary" value="{{ 'RECOVER' | translate }}" (click)="recoverAccount()">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="text-center">
                                        <a href="#login" tabindex="6" class="forgot-password" >{{ 'GO_TO_LOGIN' | translate }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `
})

export class RecoveryComponent {
    
    invalid_email_error: boolean = false;
    error: string = '';
    email: string = '';
    
    constructor(private auth_service: AuthService, private router: Router) {}
    
    recoverAccount(){
        this.auth_service.recoverAccount(this.email).subscribe((response: MyResponse) => {
            this.invalid_email_error = response.hasErrors();
            this.error = response.getErrorMessage();
        });
    }
    
    showError(){
        return this.invalid_email_error;
    }
    
};