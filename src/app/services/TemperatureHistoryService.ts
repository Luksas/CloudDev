import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class TemperatureHistoryService {

    constructor(private http: HttpClient) {}
    
    getTemperatureHistory(settings: TemperatureHistoryInput) : Observable<any> {
        return this.http.post(environment.service_url + "TemperatureHistory/gethistory", settings);
    }

}

export class TemperatureHistoryInput {
    
    slave_id: number;
    mode: string;
    selection_mode: number = 0;        
    start_date: string = '0000-00-00';
    end_date: string = '0000-00-00';
    
}