import { Component, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';

@Component({
    selector: 'boost-widget',
    template: `
        <table style="width: 205px;">
            <tr>
                <td>
                    <onoff-widget style="left: 75px; position: relative;" modbus_key='COILS_5' image='img-boost'></onoff-widget>
                </td>
            </tr>

            <tr>
                <td>
                    <range-widget *ngIf="show_range" modbus_key='HR_107' max="18000" unit="MIN" caption="BOOST" step="1" coef="60"></range-widget>
                </td>
            </tr>
        </table>
    `
})

export class BoostWidgetComponent implements OnInit {
    
    show_range: boolean = false;
        
    constructor(private data_service: RegisterDataService) {}
    
    ngOnInit(){        
        this.subscribeBoostButtonEvent();
    }
    
    private subscribeBoostButtonEvent(){
        this.data_service.get('COILS_5').subscribe(register => {
            this.show_range = +register.value > 0;
        });
    }
    
};