import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';


@Component({
    selector: 'MCBOtherComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <range-widget class="inline-block" modbus_key='HR_12' unit="HOUR" min="0" max="23" caption="FIRE_DAMPER" add_coef="1" step="1"></range-widget>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBOtherComponent implements OnInit {   
    
    constructor(private command_service: CommandService) {}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 12, 1)
        ]);

    }
};