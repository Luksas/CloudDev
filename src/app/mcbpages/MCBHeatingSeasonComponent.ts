import { Component, OnInit } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBHeatingSeasonComponent',
    styles: [`
        .s-block {
            display: inline-grid;
            padding-right: 3px;
        }
    `],
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
           <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block" *ngIf="heating_season_value == 3">
                            <range-widget modbus_key='HR_20' max="30" caption="HEATING_SEASON_TEMPERATURE_LIMIT" step="1"></range-widget>
                        </div>
                        
                        <div class="inline-block" *ngIf="heating_season_value == 2">
                            <range-widget modbus_key='HR_16' min="1" max="12" caption="start MONTH" step="1"></range-widget>
                            <range-widget modbus_key='HR_17' min="1" max="31" caption="start DAY" step="1"></range-widget>
                            <range-widget modbus_key='HR_18' min="1" max="12" caption="end MONTH" step="1"></range-widget>
                            <range-widget modbus_key='HR_19' min="1" max="31" caption="end DAY" step="1"></range-widget>
                        </div>
                    </td>
                </tr>
           
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div>
                            <shared-register-widget class='s-block' modbus_key='HR_15' image='img-cooling' active_value="0"></shared-register-widget>
                            <shared-register-widget class='s-block' modbus_key='HR_15' image='img-heating2' active_value="1"></shared-register-widget>
                            <shared-register-widget class='s-block' modbus_key='HR_15' image='img-heatingcalendarsmall' active_value="2"></shared-register-widget>
                            <shared-register-widget class='s-block' modbus_key='HR_15' image='img-coolingheatingtempset' active_value="3"></shared-register-widget>
                        </div>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBHeatingSeasonComponent implements OnInit {   
    
    heating_season_value: number;
    
    constructor(private register_service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){
        this.subscribeHeatingSeasonChangedEvent();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 15, 6),  
        ]);
    }
    
    private subscribeHeatingSeasonChangedEvent(){
        this.register_service.get('HR_15').subscribe(register => {
            this.heating_season_value = +register.value;
        });
    }
    
};