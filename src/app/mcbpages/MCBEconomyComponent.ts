import { Component, OnInit } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBEconomyComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
        
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        <onoff-widget class="mcb-left" text='ENERGY_SAVING' reverse="false" value="165" modbus_key="HR_4" image="img-energysavingon" image_off="img-energysavingoff"></onoff-widget>
                        <onoff-widget class="mcb-left" *ngIf="show_recirculation" text='FULL_RECIRCULATION' modbus_key="COILS_7" image="img-energysavingon" image_off="img-energysavingoff"></onoff-widget>
                        <range-widget class="inline-block" modbus_key='HR_4' min="160" max="300" caption="SET_POINT" step="0.5" coef="10"></range-widget>
                    </td>
                </tr>
            </table>

            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBEconomyComponent implements OnInit {
    
    show_recirculation: boolean = false;
    
    constructor(private service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){
        this.subscribeShowRecirculationEvent();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(1, 7, 1),
            new PartialReadCommand(1, 122, 1),
            new PartialReadCommand(3, 4, 1),  
        ]);
    }
    
    private subscribeShowRecirculationEvent(){
        this.service.get('COILS_122').subscribe(register => {
            this.show_recirculation = +register.value == 1;
        });
    }
    
};