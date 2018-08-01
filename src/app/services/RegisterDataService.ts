import { Injectable, OnInit, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterList } from '../data/RegisterList';
import { MyResponse} from '../data/MyResponse';
import { AirHandlingUnit } from '../data/AirHandlingUnit';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/';
import { Register } from '../data/Register';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterDataService implements OnInit {

    private interval: any;

    private active_slave: AirHandlingUnit;
    
    private register_list: RegisterList = new RegisterList();

    constructor(private http: HttpClient) {}
    
    ngOnInit(){}
    
    public cleanRegisters(){
        this.register_list.cleanRegisters();
    }
    
    public loadAirHandlingUnit(ahu: AirHandlingUnit){
        this.active_slave = ahu;
    }
    
    /**
     * 4 ---- holding register (3)
     * 5 ---- coil (1)
     * 6 ---- discrete input (2)
     * 7 ---- input register (4)
     */
    public get(key: string) : Subject<Register> {
        if (key === undefined) {
            throw new Error("Key should never be undefined.");
        }
        
        return this.register_list.get(key);
    }
    
    // forcefully emits given register by key (useful for forcing ui changes);
    public forceEmit(keys: string[]){
        for (let i = 0; i < keys.length; i++) {
            this.register_list.nextByKey(keys[i]);
        }
    }
    
    public getValue(key: string) : string {
        // Get register and then get its value!
        return this.register_list.get(key).value.value;
    }
    
    public getList(keys: string[]) : Subject<Register>[] {
        let list: Subject<Register>[] = [];
        
        for (let i = 0; i < keys.length; i++) {
            list.push(this.get(keys[i]));
        }
        
        return list;
    }
    
    public next(register: Register){
        this.sendSingleRegisterToServer(register);
        this.register_list.next(register);
    }
    
    public nextNoHttp(register: Register){
        this.register_list.next(register);
    }
    
    public start(){
        if (this.isAlreadyStarted()) {
            return;
        }
        
        this.interval = setInterval(() => { this.poll(); }, 2000);
    }
    
    public stop(){
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = false;
        }
    }
    
    public poll(){
        if (this.active_slave === undefined) {
            return this.stop();
        }
        
        this.http.get(environment.service_url + 'Registers/getSlavesDataBySlavesId/' + this.active_slave.id + "/" + Math.random())
            .map((response) => { return new MyResponse(response['error'], response['data']); })
            .subscribe(response => {
                if (response.hasErrors()) {
                    return this.stop();
                }
                
                this.register_list.loadRegistersFromResponse(response.response as any[]);
            });
    }
    
    private sendSingleRegisterToServer(register: Register){
        if (this.active_slave === undefined) {
            return;
        }
        
        
        // To-Do ignore changes on register for specific amount of time, atleast till req finished
        register.ignore_polls = 2;
        this.http.post(environment.service_url + 'Registers/setSingleRegister', {
            "modbus_function_code": register.modbus_function_code,
            "address": register.address,
            "value": register.value,
            "slave_id": this.active_slave.id
        }).subscribe();
    }
    
    public getActiveSlave(){
        return this.active_slave;
    }
    
    private isAlreadyStarted(){
        return this.interval;
    }
    

}