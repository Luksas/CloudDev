import { Component, OnInit, Input, NgZone  } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { Register } from '../../data/Register';

@Component({
    selector: 'range-widget',
    templateUrl: './RangeWidgetComponent.html',
    styleUrls: ['./RangeWidget.css']
})

export class RangeWidgetComponent implements OnInit {
    
     
    @Input() modbus_key: string;
    
    @Input() caption: string = "";
    @Input() unit: string = "";
    @Input() min: number = 0;
    @Input() max: number = 30;
    @Input() step: number = 0.5;
    @Input() filter: string = "";
    @Input() coef: number = 1;
    @Input() add_coef: number = 0;
    
    register: Register;
    value: string;
    
    constructor(private register_service: RegisterDataService, private zone : NgZone ) {}
    
    ngOnInit(){
        this.register_service.get(this.modbus_key).subscribe(register => { 
            this.register = register; 
            this.value = this.getUserValueFromRegister(this.register.value);
        });
    }
    
    increment(){
        this.update((+this.value + +this.step).toString(), false);
    }
    
    decrement(){
        this.update((+this.value - +this.step).toString(), false);
    }
    
    update(value: string, need_to_restore: boolean){
        if (this.isTooHigh(value) || this.isTooLow(value)) {
            if (need_to_restore) {
                this.restoreOldValue(value);
            }
            
            return;
        }
        
        this.value = value; 
        this.register.value = this.getRegisterValueFromUserValue(value);
        this.register_service.next(this.register);
    }
    
    private isTooHigh(value: string){
        return +this.getRegisterValueFromUserValue(value) > this.max;
    }
    
    private isTooLow(value: string){
        return +this.getRegisterValueFromUserValue(value) < this.min;
    }
    
    // Converts visible user value to register value
    private getRegisterValueFromUserValue(user_value: string) : string {
        return ((+user_value - +this.add_coef) * this.coef).toString();
    }
    
    // Converts register value to user value 
    private getUserValueFromRegister(register_value: string) : string {
        return ((+register_value + +this.add_coef) / this.coef).toString();
    }
    
    private restoreOldValue(value: string){
        this.zone.run(() => {
            this.value = value;
        });
    }
    
};