import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { MyResponse} from '../data/MyResponse';
import { environment } from '../../environments/environment';
import {Router} from '@angular/router';
import {Account} from '../data/Account';


@Injectable()
export class AuthService {

    private is_authenticated: boolean = false;
    private account: Account;

    constructor(private http: HttpClient, private router: Router) {
        this.clearSession();
        this.loadSession();
    }
    
    getAccount() : Account {
        return this.account;
    }
    
    isAuthenticated(): boolean {
        return this.is_authenticated;
    }
    
    loadSession(){
        this.loadSessionFromStorage();
        
        if (this.isAuthenticated()) {
            return;
        }
        
        this.checkServerSession().subscribe((response: MyResponse) => {
            if (response.hasErrors()) {
                this.clearSession();
                return;
            }
            
            this.account = new Account(response.response);
            this.is_authenticated = true;
            this.saveSessionToLocalStorage(this.account);
            
            if (this.router.url.toLowerCase() == '/login') {
                this.router.navigate(['home']);
            }
        });
    }
    
    checkServerSession(): Observable<MyResponse> {
        return this.http.post(environment.service_url + 'Users/checkSession', {}).map(this.mapToMyResponse);
    }
    
    loadSessionFromStorage() {
        this.is_authenticated = localStorage.getItem('is_authenticated') === 'true' && localStorage.getItem('account') !== undefined;
        this.account = new Account(JSON.parse(localStorage.getItem('account')));
    }
    
    login(username: string, password: string, action: any) {
        let sub = this.http.post(environment.service_url + 'Users/login', {
            username: username,
            password: password
        }).map(this.mapToMyResponse);
        
        sub.subscribe(response => {
            if (response.hasErrors()) {
               this.clearSession();
               this.goToLoginPage();
               return;
            }
            
            this.account = new Account(response.response);
            this.is_authenticated = true;
            this.saveSessionToLocalStorage(this.account);
            action(response);
        });
    }
    
    logout() : Observable<any> {
        this.clearSession();
        return this.http.get(environment.service_url + 'Users/logout');
    }
    
    recoverAccount(email: string) : Observable<any> {
        return this.http.post(environment.service_url + 'Users/recover', {email: email}).map(this.mapToMyResponse);
    }
    
    private saveSessionToLocalStorage(account: Account){
        localStorage.setItem('is_authenticated', 'true');
        localStorage.setItem('account', JSON.stringify(account));
    }
    
    private mapToMyResponse(response: any) : MyResponse {
        return new MyResponse(response['error'], response['data']);
    }
    
    private clearSession(){
        localStorage.clear();
        this.is_authenticated = false;
        this.account = new Account();
    }
    
    private goToLoginPage(){
        this.router.navigate(['login']);
    }
    

}