import { Component, Input, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { Register } from '../../data/Register';

@Component({
    selector: 'scheduler-widget',
    template: `
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-body">
                        <div class="row">
                            <onoff-widget modbus_key="control_key" image="img-on" image_off="img-off"></onoff-widget>
                            <shared-register-widget class="inline-block" modbus_key="mode_key" image='img-standby' active_value="0"></shared-register-widget>
                            <shared-register-widget class="inline-block" modbus_key="mode_key" image='img-building_protection' active_value="1"></shared-register-widget>
                            <shared-register-widget class="inline-block" modbus_key="mode_key" image='img-economy' active_value="2"></shared-register-widget>
                            <shared-register-widget class="inline-block" modbus_key="mode_key" image='img-comfort' active_value="3"></shared-register-widget>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class SchedulerWidgetComponent implements OnInit {
    
    @Input() keys: SchedulerKeys;
    
    visible: boolean = false;
    
    control_key: string;
    mode_key: string;
    point_key: string;
    weekday_key: string;
    hour_key: string;
    minute_key: string;
    
    control: Register;
    mode: Register;
    point: Register;
    weekday: Register;
    hour: Register;
    minute: Register;

    constructor(private register_service: RegisterDataService) {}
    
    ngOnInit(){
        this.control_key = 'HR' + this.keys.control;
        this.mode_key = 'HR' + this.keys.mode;
        this.point_key = 'HR' + this.keys.point;
        this.weekday_key = 'HR' + this.keys.weekday;
        this.hour_key = 'HR' + this.keys.hour;
        this.minute_key = 'HR' + this.keys.minute;
        
        this.subscribeKeyRegisters();
    }
    
    private subscribeKeyRegisters(){
        this.register_service.get('HR' + this.keys.control).subscribe((register) => {
            this.control = register;
        });
        
        this.register_service.get('HR' + this.keys.mode).subscribe((register) => {
            this.mode = register;
        });
        
        this.register_service.get('HR' + this.keys.point).subscribe((register) => {
            this.point = register;
        });
        
        this.register_service.get('HR' + this.keys.weekday).subscribe((register) => {
            this.weekday = register;
        });
        
        this.register_service.get('HR' + this.keys.hour).subscribe((register) => {
            this.hour = register;
        });
        
        this.register_service.get('HR' + this.keys.minute).subscribe((register) => {
            this.minute = register;
        });
    }

};

export class SchedulerKeys {
    
    control: number;
    mode: number;
    point: number;
    weekday: number;
    hour: number;
    minute: number;
    
}