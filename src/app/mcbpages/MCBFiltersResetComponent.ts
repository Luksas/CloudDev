import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBFiltersResetComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block">
                            <onoff-widget text="FILTER_RESET_TIMER" value="1" modbus_key="COILS_1" image="img-refresh"></onoff-widget>
                            <meter-widget text="LEFT_DAYS" value_modbus_key="IR_30" max_value_modbus_key="HR_660"></meter-widget>
                        </div>
                    </td>
                </tr>
            </table>
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBFiltersResetComponent implements OnInit {   
    
    constructor(private command_service: CommandService) {}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(1, 1, 1),
            new PartialReadCommand(3, 660, 1),
            new PartialReadCommand(4, 30, 1)
        ]);
    }
};