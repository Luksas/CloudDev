import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { MyResponse } from '../data/MyResponse';
import { environment } from '../../environments/environment';
import { Account } from '../data/Account';

@Injectable()
export class UserService implements OnInit {
    
    constructor(private http: HttpClient) {}
    
    ngOnInit(){}
    
    update(account: Account): Observable<MyResponse> {
        return this.http.post(environment.service_url + 'Users/update', {
            id: account.id,
            email: account.email
        }).map(this.mapToMyResponse);
    }
    
    register(username: string, password: string, password_reenter: string, email: string): Observable<MyResponse> {
        return this.http.post(environment.service_url + 'Users/register', {
            username: username,
            password: password,
            password_reenter: password_reenter,
            email: email
        }).map(this.mapToMyResponse);
    }
    
    mapToMyResponse(response: any) : MyResponse {
        return new MyResponse(response['error'], response['data']);
    }

}