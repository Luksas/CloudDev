import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { MyResponse} from '../data/MyResponse';
import { environment } from '../../environments/environment';
import { AirHandlingUnit } from '../data/AirHandlingUnit';

@Injectable()
export class DeviceService {
    
    // To-do catche data here, not in component. And then grab it from here in component.
    
    constructor(private http: HttpClient) {}
    
    getDeviceList(): Observable<MyResponse> {
        return this.http.get(environment.service_url + 'Devices/getDevices').map(this.mapToMyResponse);
    }
    
    getSlaveListByGatewayID(device_id: string):Observable<MyResponse> {
        return this.http.get(environment.service_url + 'Devices/getDeviceSlaves/' + device_id).map(this.mapToMyResponse);
    }
    
    getCurrentUserSlavesList():Observable<MyResponse> {
        return this.http.get(environment.service_url + 'Devices/getAllUserSlaves/').map(this.mapToMyResponse);
    }
    
    registerDevice(name: string, mac: string): Observable<MyResponse>{
        return this.http.post(environment.service_url + 'Devices/register', {
            name: name,
            mac: mac
        }).map(this.mapToMyResponse);
    }
    
    updateSlave(ahu: AirHandlingUnit) : Observable<MyResponse> {
        return this.http.post(environment.service_url + 'Devices/updateSlave', ahu).map(this.mapToMyResponse);
    }
    
    deleteSlave(slave_id: number) : Observable<MyResponse> {
        return this.http.get(environment.service_url + 'Devices/removeSlave/' + slave_id).map(this.mapToMyResponse);
    }
    
    private mapToMyResponse(response: any) : MyResponse {
        return new MyResponse(response['error'], response['data']);
    }

}