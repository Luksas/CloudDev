import { Component, Input, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { Register } from '../../data/Register';

@Component({
    selector: 'x-v-widget',
    templateUrl: './XVWidget.html',
    styleUrls: ['./XVWidget.css']
})

export class XVWidget implements OnInit {
    
    @Input() modbus_key: string;
    register: Register;
    active: boolean;

    constructor(private register_data_service: RegisterDataService) {}
    
    ngOnInit(){
        this.register_data_service.get(this.modbus_key).subscribe(register => {
            this.register = register;
            this.update();
        });
    }
    
    trigger(){
        this.isActive() ? this.disable() : this.activate();
        this.update();
        
        this.register_data_service.next(this.register);
    }
    
    private isActive() : boolean {
        return this.register.value == "1";
    }
    
    private activate(){
        this.register.value = "1";
    }

    private disable(){
        this.register.value = "0";
    }
    
    private update(){
        this.active = this.isActive();
    }
    
};