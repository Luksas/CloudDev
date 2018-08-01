import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBFansComponent',
    templateUrl: './MCBFansComponent.html',
})

export class MCBFansComponent implements OnInit, OnDestroy {
    
    fans_mode: number = 0;
    control_by_fans: boolean = true;
    control_by_percentage: boolean = false;
    show_percentage_setpoint: boolean;

    max_setpoint_value: number;
    min_setpoint_value: number;

    // 4 ---- holding register (3)
    // 5 ---- coil (1)
    // 6 ---- discrete input (2)
    // 7 ---- input register (4)
    constructor(private data_service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){        
        this.data_service.start();
        this.subscribeBoostButtonEvent();
        this.subscribeControlTypeEvent();
        this.subscribeAirflowPercentageChangedEvent();
        this.subscribeMinMaxSetPointValueChangedEvent();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(1, 117, 1),
            new PartialReadCommand(3, 1, 6),
            new PartialReadCommand(3, 661, 2),
        ]);
    }
    
    ngOnDestroy(){
        this.data_service.stop();
    }
    
    private subscribeBoostButtonEvent(){
        this.data_service.get('HR_1').subscribe(register => {
            this.fans_mode = +register.value;
        });
    }
    
    private subscribeControlTypeEvent(){
        this.data_service.get('COILS_117').subscribe(register => {
            this.control_by_fans = +register.value == 1;
            this.control_by_percentage = !this.control_by_fans;
        });
    }
    
    private subscribeAirflowPercentageChangedEvent(){
        this.data_service.get('HR_3').subscribe(register => {
            this.show_percentage_setpoint = +register.value > 19;
        });
    }
    
    private subscribeMinMaxSetPointValueChangedEvent(){
        this.data_service.get('HR_661').subscribe(register => {
            this.min_setpoint_value = +register.value;
        });
        
        this.data_service.get('HR_662').subscribe(register => {
            this.max_setpoint_value = +register.value;
        });
    }
    
};