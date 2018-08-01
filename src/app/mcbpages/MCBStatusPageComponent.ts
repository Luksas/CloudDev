import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterDataService } from '../services/RegisterDataService';
import { CommandService } from '../services/CommandService';
import { PartialReadCommand } from '../data/ReadCommand';
import { StatusItem } from '../data/StatusItem';

@Component({
    selector: 'MCBStatusPageComponent',
    styles: [`
        .block {
            float: left;
            width: 200px;
            height: 100px;
            border-radius: 10px;
            border: solid 1px white;
        }
        
        .full {
            width: 100%;
            height: 50%;
        }
    `],
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
            
            <table class="mcb-page">
                <tr>                
                    <td class="bottom" style="text-align: center;">
                        <mcb-status-widget [item]="configuration_version"></mcb-status-widget>
                        <mcb-status-widget [item]="software_version"></mcb-status-widget>
                        <mcb-status-widget [item]="water_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="stand_by_blocking_time_left"></mcb-status-widget>
                        <mcb-status-widget [item]="current_fixed_airflow"></mcb-status-widget>
                        <mcb-status-widget [item]="current_airflow"></mcb-status-widget>
                        <mcb-status-widget [item]="required_supply_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="supply_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="extract_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="exhaust_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="fresh_temperature"></mcb-status-widget>
                        <mcb-status-widget [item]="active_alarm_count"></mcb-status-widget>
                        <mcb-status-widget [item]="bootloader_version"></mcb-status-widget>
                    </td>
                </tr>
            </table>
        </div>
    `
})

export class MCBStatusPageComponent implements OnInit, OnDestroy {   
    
    configuration_version: StatusItem = { value: 0, visible: true, desc: "CONFIGURATION_VERSION" } as StatusItem;
    software_version: StatusItem = { value: 0, visible: true, desc: "SOFTWARE_VERSION" } as StatusItem;
    water_temperature: StatusItem = { value: 0, visible: false, desc: "WATER_TEMPERATURE" } as StatusItem;
    stand_by_blocking_time_left: StatusItem = { value: 0, visible: false, desc: "STAND_BY_BLOCKING_TIME_LEFT" } as StatusItem;
    current_fixed_airflow: StatusItem = { value: 0, visible: true, desc: "CURRENT_FIXED_AIRFLOW" } as StatusItem; 
    current_airflow: StatusItem = { value: 0, visible: true, desc: "CURRENT_AIRFLOW" } as StatusItem; 
    required_supply_temperature: StatusItem = { value: 0, visible: true, desc: "REQUIRED_SUPPLY_TEMPERATURE"} as StatusItem; 
    supply_temperature: StatusItem = { value: 0, visible: true, desc: "SUPPLY_AIR_TEMPERATURE" } as StatusItem; 
    extract_temperature: StatusItem = { value: 0, visible: true, desc: "EXTRACT_AIR_TEMPERATURE" } as StatusItem; 
    exhaust_temperature: StatusItem = { value: 0, visible: true, desc: "EXHAUST_AIR_TEMPERATURE" } as StatusItem; 
    fresh_temperature: StatusItem = { value: 0, visible: true, desc: "FRESH_AIR_TEMPERATURE" } as StatusItem; 
    supply_air_rh: StatusItem = { value: 0, visible: false, desc: "SUPPLY_AIR_RH" } as StatusItem; 
    extract_air_rh: StatusItem = { value: 0, visible: false, desc: "EXTRACT_AIR_RH" } as StatusItem; 
    extract_air_co2: StatusItem = { value: 0, visible: false, desc: "EXTRACT_AIR_CO2" } as StatusItem; 
    active_alarm_count: StatusItem = { value: 0, visible: false, desc: "ACTIVE_ALARM_COUNT" } as StatusItem; 
    rotor_service_timer: StatusItem = { value: 0, visible: true, desc: "ROTOR_SERVICE_TIMER" } as StatusItem; 
    bootloader_version: StatusItem = { value: 0, visible: true, desc: "BOOTLOADER_VERSION" } as StatusItem; 
    
    constructor(private register_service: RegisterDataService, private command_service: CommandService) {}
    
    ngOnInit(){
        this.registerStatusValueRegisters();
        this.registerStatusVisiblityRegisters();
        this.register_service.start();
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(4, 1, 32),   // IR
            new PartialReadCommand(3, 600, 30), // HR
        ]);
    }
    
    ngOnDestroy(){
        this.register_service.stop();
    }
    
    // To-do, create status item generation engine (TASK FOR FUTURE).
    private registerStatusValueRegisters(){
        this.register_service.get('IR_2').subscribe((register) => {
            this.software_version.value = +register.value / 100;
        });
        
        this.register_service.get('IR_3').subscribe((register) => {
            this.configuration_version.value = +register.value / 100;
        });
        
        this.register_service.get('IR_90').subscribe((register) => {
            this.water_temperature.value = +register.value / 10;
        });
        
        this.register_service.get('IR_14').subscribe((register) => {
            this.stand_by_blocking_time_left.value = +register.value;
        });
        
        this.register_service.get('IR_15').subscribe((register) => {
            this.current_fixed_airflow.value = +register.value;
        });
        
        this.register_service.get('IR_16').subscribe((register) => {
            this.current_airflow.value = +register.value;
        });
        
        this.register_service.get('IR_17').subscribe((register) => {
            this.required_supply_temperature.value = +register.value / 10;
        });
        
        this.register_service.get('IR_18').subscribe((register) => {
            this.supply_temperature.value = +register.value / 10;
        });
        
        this.register_service.get('IR_19').subscribe((register) => {
            this.extract_temperature.value = +register.value / 100;
        });
        
        this.register_service.get('IR_20').subscribe((register) => {
            this.exhaust_temperature.value = +register.value / 10;
        });
        
        this.register_service.get('IR_21').subscribe((register) => {
            this.fresh_temperature.value = +register.value / 10;
        });
        
        this.register_service.get('IR_28').subscribe((register) => {
            this.active_alarm_count.value = +register.value;
        });
        
        this.register_service.get('IR_31').subscribe((register) => {
            this.bootloader_version.value = +register.value / 100;
        });
    }
    
    private registerStatusVisiblityRegisters(){
        this.register_service.get('HR_600').subscribe((register) => {
            this.bootloader_version.visible = +register.value == 3;
        });
        
        this.register_service.get('HR_626').subscribe((register) => {
            this.supply_temperature.visible = +register.value != 0;
        });
        
        this.register_service.get('HR_627').subscribe((register) => {
            this.extract_temperature.visible = +register.value != 0;
        });
        
        this.register_service.get('HR_628').subscribe((register) => {
            this.exhaust_temperature.visible = +register.value != 0;
        });
        
        this.register_service.get('HR_629').subscribe((register) => {
            this.fresh_temperature.visible = +register.value != 0;
        });
        
        this.register_service.get('IR_28').subscribe((register) => {
            this.active_alarm_count.visible = +register.value > 0;
        });
    }
    
    
};