import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';
import { SchedulerKeys } from '../widgets/scheduler_widget/SchedulerWidgetComponent';


@Component({
    selector: 'MCBSchedulerPageComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <scheduler-widget *ngFor="let schedule_key of schedule_keys" [keys]="schedule_key"></scheduler-widget>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBSchedulerPageComponent implements OnInit, OnDestroy {   
    
    schedule_keys: SchedulerKeys[];
    
    constructor(private register_service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){
        this.register_service.start();
        this.sendReadCommandsToDevice();
        this.generateSchedulerKeys();
    }
    
    ngOnDestroy(){
        this.register_service.stop();
    }
    
    private sendReadCommandsToDevice(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 250, 309)
        ]);
    }
    
    private generateSchedulerKeys(){
        this.schedule_keys = [];
        
        for (let i = 0; i < 10; i++) {
            let temp = new SchedulerKeys();
            temp.control = 250 + i * 6;
            temp.mode = 251 + i * 6;
            temp.point = 252 + i * 6;
            temp.weekday = 253 + i * 6;
            temp.hour = 254 + i * 6;
            temp.minute = 255 + i * 6;
            this.schedule_keys.push(temp);
        }
    }
    
};