import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class AlarmHistoryService {

    constructor(private http: HttpClient) {}
    
    getAlarmHistory(slave_id: number,) : Observable<any> {
        return this.http.get(environment.service_url + "History/getAlarmHistory/" + slave_id);
    }

}