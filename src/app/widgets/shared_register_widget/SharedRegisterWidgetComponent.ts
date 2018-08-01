import { Component, Input, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { Register } from '../../data/Register';

@Component({
    selector: 'shared-register-widget',
    templateUrl: './SharedRegisterWidgetComponent.html',
    styleUrls: ['./SharedRegisterWidgetComponent.css']
})

export class SharedRegisterWidgetComponent implements OnInit {
    
    @Input() modbus_key: string;
    @Input() image: string;
    @Input() active_value: string;
    
    active_class: string;
    register: Register;

    constructor(private register_data_service: RegisterDataService) {}
    
    ngOnInit(){
        this.register_data_service.get(this.modbus_key).subscribe(register => {
            this.register = register;
            this.updateActiveClass();
        });
    }
    
    trigger(){
        if (!this.isActive()) {
            this.activate()
            this.register_data_service.next(this.register);
            this.updateActiveClass();
        }
    }
    
    private isActive(){
        return this.active_value == this.register.value;
    }
    
    private activate(){
        this.register.value = this.active_value;
    }
    
    private updateActiveClass(){
        if (this.isActive()) {
            this.active_class = "b-active";
            return;
        }
        
        this.active_class = "";
    }

};