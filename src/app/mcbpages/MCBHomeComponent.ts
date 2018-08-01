import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';

@Component({
    selector: 'MCBHomeComponent',
    styles: [`
        .sized {
            width: 100%;
        }
        
        .status-block {
            font-size: 40px;
            text-align: center; 
        }
    `],
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
        
            <table class="mcb-page">
                <tr>
                    <td class="bottom sized">
                        <boost-widget class="ignore"></boost-widget>
                    </td>
                </tr>
                <tr style="height: 40px;">
                    <td class="bottom sized">
                        <div class="status-block">
                            {{ system_status[status_index] | translate }}
                        </div>
                    </td>
                </tr>
            </table>
            
            

            <mcbhomemenu-widget></mcbhomemenu-widget>
        </div>
    `
})

export class MCBHomeComponent implements OnInit, OnDestroy {
    
    status_index: number;
    system_status: string[] = [
        '',
        '',
        '',
        '',
        'EMERGENCY_RUN',
        'PREPARING', 
        'OPENING_DAMPERS',
        'BOOST', 
        'COOLING_HEATERS',
        'CLOSING_DAMPERS', 
        'NIGHT_COOLING', 
        'CRITICAL_ALARM', 
        'FIRE_ALARM', 
        'HEAT_EXCHANGER_FROST_PROTECTION',
        'CHANGE_FILTERS', 
        'ROOM_RH_LIMITING_SPEED'
    ];

    constructor(private register_service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){        
        this.subcribeStatusIndexChangedEvent();
        this.register_service.start();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(4, 1, 1), // System status (DI)
            new PartialReadCommand(3, 1, 1), // System mode (HR)
            new PartialReadCommand(3, 107, 1), // Boost timer
            new PartialReadCommand(2, 1, 60), // Read all alerts (1-57 DI)
            new PartialReadCommand(1, 5, 1) // Boost on/off (Coils 5)
        ]);
        
        this.register_service.forceEmit(['HR_2', 'HR_4', 'HR_6']);
    }
    
    ngOnDestroy(){
        this.register_service.stop();
    }
    
    private subcribeStatusIndexChangedEvent(){
        this.register_service.get('IR_1').subscribe(register => {
            this.status_index = +register.value;
        });
    }
    
};