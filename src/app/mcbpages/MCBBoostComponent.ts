import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBBoostComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <range-widget class="inline-block" modbus_key='HR_14' max="18000" unit="MIN" caption="BOOST_TIMER" coef="60" step="1"></range-widget>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBBoostComponent implements OnInit {   
    
    constructor(private command_service: CommandService) {}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 14, 1),
        ]);
    }
};