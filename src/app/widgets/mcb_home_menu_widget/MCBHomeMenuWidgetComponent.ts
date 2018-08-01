import { Component, OnInit, Input, ChangeDetectorRef  } from '@angular/core';
import { MCBHomeItem } from '../../data/MCBHomeItem';
import { Router } from '@angular/router';
import { RegisterDataService} from '../../services/RegisterDataService';
import { AlarmService } from '../../services/AlarmService';
import { CommandService } from '../../services/CommandService';
import { PartialReadCommand } from '../../data/ReadCommand';

@Component({
    selector: 'mcbhomemenu-widget',
    template: `
        <div>
            <mcbhomemenublock *ngIf="alarm_class != '' && show_fans" style="cursor:pointer;" (click)="goTo('mcbalarms')" [item_class]="alarm_class" [item]="alarm_item"></mcbhomemenublock>
            <mcbhomemenublock style="cursor:pointer;" (click)="goTo('mcbfans')" *ngIf="show_fans" [item]="fans_item"></mcbhomemenublock>
            <mcbhomemenublock *ngFor="let block of items" [item]="block"></mcbhomemenublock>
        </div>
    `
})

export class MCBHomeMenuWidgetComponent implements OnInit {

    @Input() 
    show_fans: boolean = true;
    
    items: MCBHomeItem[];
    fans_item: MCBHomeItem;
    alarm_item: MCBHomeItem;    
    alarm_class: string = "";
    
    constructor(
        private router: Router, 
        private service: RegisterDataService, 
        private alarm_service: AlarmService,
        private command_service: CommandService,
        private app: ChangeDetectorRef
         ) {}

    // 4 ---- holding register (3)
    // 5 ---- coil (1)
    // 6 ---- discrete input (2)
    // 7 ---- input register (4)
    ngOnInit() {
        this.initiateItems();
        
        if (this.show_fans) {
            this.subscribeFansItemChange();
        }
        
        this.subscribeAlarmClassChangedEvent();
        this.createMCBAlarmPageWidget();
        
        this.addSupplyItem();
        this.addFreshItem();
        this.addExtractItem();
        this.addExhaustItem();
        this.addSupplyHumidityItem();
        this.addExtractHumidityItem();
        this.addSupplyCO2Item();
        this.addExtractCO2Item();        
        
        this.command_service.sendReadCommands([
            new PartialReadCommand(1, 117, 1),
            new PartialReadCommand(3, 1, 6),  
            new PartialReadCommand(3, 626, 4),
            new PartialReadCommand(4, 18, 7)
        ]);
    }
    
    goTo(where: string){
        this.router.navigate([where]);
    }
    
    /*
     * TO-DO ---- refactor later
     * how it works:
     *  --- loads list of all alerts
     *  --- subscribes register change event to each of those!
     *  --- once register changes the event is called
     *  --- the event then goes thrue all alarm register data
     *  --- if it is active, loads warning/alarm class
     */
    private subscribeAlarmClassChangedEvent(){
        this.alarm_class = "";
        let alert_keys_list: string[] = this.alarm_service.getAllAlertListKeys();
        let subs = this.service.getList(alert_keys_list);
        
        for (let i = 0; i < subs.length; i++) {
            subs[i].subscribe(register => {
                this.alarm_class = "";
                
                for (let index = 0; index  < alert_keys_list.length; index ++) {
                    var key = alert_keys_list[index];
                    var value = +this.service.getValue(key);
                    
                    if (value == 0) {
                        continue;
                    }
                    
                    if (this.alarm_service.isWarning(key) && this.alarm_class == "") {
                        this.alarm_class = "warning";
                    }
                    
                    if (this.alarm_service.isAlarm(key)) {
                        this.alarm_class = "alert";
                        break;
                    }
                }
            });
        }
    }
    
    private subscribeFansItemChange(){
        this.service.get('HR_1').subscribe((register) => {
            this.fans_item = null;
            this.fans_item = new MCBHomeItem("Fans control", "img-supply", true, "HR_6", "COILS_117", 10, 0);
            
            // Show different value depending on selected mode!
            switch(+register.value){
                case 0:
                    this.fans_item.value_key = '';
                    break;
                case 1:
                    this.fans_item.value_key = 'HR_6';
                    break;
                case 2:
                    this.fans_item.value_key = 'HR_4';
                    break;
                case 3:
                    this.fans_item.value_key = 'HR_2';
                    break;
                default: break;
            }
            
            this.fans_item.image = ["img-standby", "img-building_protection", "img-economy", "img-comfort"][+register.value];
            this.fans_item.name = ["STAND_BY", "BUILDING_PROTECTION", "ECONOMY", "COMFORT"][+register.value];
            console.log(this.fans_item.value_key);
        });
    }
    
    
    
    private initiateItems(){
        this.items = [];
    }

    private addSupplyItem() {
        this.items.push(new MCBHomeItem("SUPPLY_AIR_TEMPERATURE", "img-supply", true, "IR_18", "HR_626", 10, 0));
    }
    
    private addFreshItem() {
        this.items.push(new MCBHomeItem("FRESH_AIR_TEMPERATURE", "img-fresh", true, "IR_21", "HR_629", 10, 0));
    }
    
    private addExtractItem() {
        this.items.push(new MCBHomeItem("EXTRACT_AIR_TEMPERATURE", "img-extract", true, "IR_19", "HR_627", 10, 0));
    }
    
    private addExhaustItem() {
        this.items.push(new MCBHomeItem("EXHAUST_AIR_TEMPERATURE", "img-exhaust", true, "IR_20", "HR_628", 10, 0));
    }
    
    private addSupplyHumidityItem() {
        this.items.push(new MCBHomeItem("SUPPLY_AIR_RH", "img-humidity", true, "IR_22", "IR_22", 10, 0));
    }
    
    private addExtractHumidityItem() {
        this.items.push(new MCBHomeItem("EXTRACT_AIR_RH", "img-humidity", true, "IR_24", "IR_24", 10, 0));
    }
    
    private addSupplyCO2Item() {
        this.items.push(new MCBHomeItem("SUPPLY_AIR_CO2", "img-co2", false, "IR_25", "IR_25", 1, 0));
    }
    
    private addExtractCO2Item() {
        this.items.push(new MCBHomeItem("EXTRACT_AIR_CO2", "img-co2", false, "IR_23", "IR_23", 1, 0));
    }
    
    private createMCBAlarmPageWidget(){
        this.alarm_item = new MCBHomeItem("ALARMS", "img-alarm", false, "", "", 1, 0);
    }

};