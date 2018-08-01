import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { Router } from '@angular/router';
import { Account } from '../../data/Account';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'AccountSettingsComponent',
    templateUrl: './AccountSettingsComponent.html'
})

export class AccountSettingsComponent implements OnInit {
    
    account: Account;
    show_error: boolean = false;
    active_language: string = 'en';
    
    constructor(
        private auth_service: AuthService, 
        private user_service: UserService, 
        private router: Router, 
        private translator: TranslateService,
        private cookies: CookieService
    ) {}
    
    ngOnInit(){
        this.loadLanguageSettings();
        this.loadAccountSettings();
    }
    
    changeLanguage(lang: string){
        this.translator.use(lang);
        this.cookies.set('language', lang, 365);
    }
    
    save(){
        this.user_service.update(this.account).subscribe(response => {
            this.show_error = response.hasErrors();
            this.auth_service.loadSession();
            this.router.navigate(['account_settings']);
        });
    }
    
    private loadLanguageSettings(){
        let language = this.cookies.get('language');
        this.active_language = language == '' ? 'en' : language;
    }
    
    private loadAccountSettings(){
        this.account = this.auth_service.getAccount();
    }

};