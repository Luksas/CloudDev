import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBNightCoolingComponent',
    template: `
        
        <div class="mcb-container">
            <mcb-header></mcb-header>
                
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block">
                            <range-widget class="large-range" modbus_key='HR_29' min="130" max="300" caption="NIGHT_COOLING_START_EXTRACT" step="0.5" coef="10"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_31' min="0" max="300" caption="NIGHT_COOLING_START_OUTDOOR" step="0.5" coef="10"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_25' min="0" max="23" caption="Start hours" add_coef="1" step="1"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_27' min="0" max="23" caption="Stop hours" add_coef="1" step="1"></range-widget>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block">
                            <range-widget class="large-range" modbus_key='HR_30' min="130" max="300" caption="NIGHT_COOLING_STOP_EXTRACT" step="0.5" coef="10"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_32' min="0" max="300" caption="NIGHT_COOLING_SETPOINT" step="0.5" coef="10"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_26' min="0" max="59" caption="Start minutes" add_coef="1" step="1"></range-widget>
                            <range-widget class="large-range" modbus_key='HR_28' min="0" max="59" caption="Start minutes" add_coef="1" step="1"></range-widget>
                        </div>
                    </td>
                </tr>
            </table>     
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBNightCoolingComponent implements OnInit {
    
    constructor(private command_service: CommandService){}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 26, 7),  
        ]);
    }
    
};