import { Component, OnInit } from '@angular/core';
import { PartialReadCommand } from '../data/ReadCommand';
import { CommandService } from '../services/CommandService';

@Component({
    selector: 'MCBHumidityComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block">
                            <onoff-widget modbus_key="COILS_3" value="1" image="img-drynessprotection" text="DRYNESS_PROTECTION"></onoff-widget>
                            <onoff-widget modbus_key="COILS_8" value="1" image="img-check" image_off="img-cross"></onoff-widget>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <div class="inline-block">
                            <range-widget modbus_key='HR_21' min="0" max="100" caption="SUMMER %" step="1"></range-widget>
                            <range-widget modbus_key='HR_22' min="0" max="100" caption="WINTER %" step="1"></range-widget>
                            <range-widget modbus_key='HR_23' min="1" max="600" caption="BOOST" step="1"></range-widget>
                        </div>
                    </td>
                </tr>
            </table>                    
            
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBHumidityComponent implements OnInit {
    
    constructor(private command_service: CommandService) {}
    
    ngOnInit(){
        this.command_service.sendReadCommands([
            new PartialReadCommand(1, 3, 1),
            new PartialReadCommand(1, 8, 1),
            new PartialReadCommand(3, 21, 3)
        ]);
    }
};