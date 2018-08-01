import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { AlarmItem } from '../../data/AlarmItem';

@Component({
    selector: 'alarm-widget',
    templateUrl: './AlarmWidgetComponent.html',
    styleUrls: ['./AlarmWidgetComponent.css']
})

export class AlarmWidgetComponent implements OnInit, OnDestroy {
    
    @Input()
    alarm_data: AlarmItem;
    
    show_alarm: boolean;

    constructor(private service: RegisterDataService) {}
    
    ngOnInit(){
        this.service.start();
        this.subscribeAlarmRegisterChangedEvent();
    }
    
    ngOnDestroy(){
        this.service.stop();
    }
    
    private subscribeAlarmRegisterChangedEvent(){
        this.service.get(this.alarm_data.modbus_key).subscribe((register) => {
            this.show_alarm = +register.value == 1;
        });
    }
    
};