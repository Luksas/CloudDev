import { Component, OnInit } from '@angular/core';
import { AlarmItem } from '../data/AlarmItem';
import { AlarmService } from '../services/AlarmService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBAlarmsPageComponent',
    template: `    
        <div class="mcb-container">
            <mcb-header></mcb-header>

            <table class="mcb-page" style="height: auto;">
                <tr>
                    <td style="text-align: center; width: 80%;">
                        <alarm-widget *ngFor="let alert of alerts" [alarm_data]="alert" ></alarm-widget>
                    </td>
                    
                    <td style="text-align: center; width: 20%; vertical-align: top;">
                        <onoff-widget modbus_key="HR_202" image="img-refresh" image_off="img-refresh" text="ALARMS_RESET"></onoff-widget>
                    </td>
                </tr>            
            </table>
        </div>        
    `
})

export class MCBAlarmsPageComponent implements OnInit {
    
    alerts: AlarmItem[];
    
    constructor(private alarm_service: AlarmService, private command_service: CommandService) {}
    
    ngOnInit(){
        this.alerts = this.alarm_service.getAllAlertList();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(2, 1, 57),
        ]);
    }
};