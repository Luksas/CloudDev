import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBCO2Component',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <range-widget class="inline-block" modbus_key='HR_679' min="0" max="1000" caption="PPM" coef="1" step="5"></range-widget>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBCO2Component implements OnInit {
    
    constructor(private command_service: CommandService) {}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(3, 679, 1),
        ]);
    }
};