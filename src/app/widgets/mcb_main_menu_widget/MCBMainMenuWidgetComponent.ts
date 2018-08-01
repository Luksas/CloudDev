import {Component, OnInit, OnDestroy } from '@angular/core';
import {MCBMainMenuItem} from '../../data/MCBMainMenuItem';
import {RegisterDataService} from '../../services/RegisterDataService';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'mcbmainmenu-widget',
    template: `
        <div class="item {{ item.active }}" *ngFor="let item of menu_items" (click)="itemClicked(item)">
     
            <div>
                <div class="{{ item.image }} img"></div>
            </div>

            <div class="caption">
                {{ item.text | translate }}
            </div>

        </div>
    `,
    styles: [`
        .item {
            height: 60px;
            max-height: 60px;
            width: 180px;
            float: left;
            overflow: hidden;
            display: inline;
            border-radius: 10px;
            margin: 5px;
            padding: 9px;
            border: solid 1px white;
            cursor: pointer;
        }
        
        .active {
            background-color: black;
        }

        .item .img {
            display: block;
            margin: 0 auto;
        }

        .item .caption {
            float: left;
            text-align: center;
            width: 100%;
            font-size: 12px;
        }
    `]
})

export class MCBMainMenuWidgetComponent implements OnInit, OnDestroy {
    
    menu_items: MCBMainMenuItem[];
    private subs: Subscription[] = [];
    private coils_active: boolean;
    private ir_active: boolean;
        
    constructor(private router: Router, private register_service: RegisterDataService) {}

    ngOnInit() {
        this.subscribeRouteChangedEvent();
        this.rebuild();
    }
    
    ngOnDestroy(){
        for (let i = 0; i < this.subs.length; i++) {
            this.subs[i].unsubscribe();
        }
    }
    
    itemClicked(item: MCBMainMenuItem) {
        if (item.visible) {
            this.router.navigate([item.href]);
        }
    }
    
    private rebuild(){
        this.menu_items = [];
        this.addBoostItem();
        //this.addNightCoolingItem();
        //this.addTimeItem();
        this.addFilterResetItem();
        this.addEconomyItem();
        this.addBuildingProtectionItem();
        this.addHeatingItem();
        this.addCO2LevelItem();
        this.addHumidityItem();
        //this.addStatusItem();
        //this.addSchedulerItem();
        this.addOtherItem();
    }
    
    private addStatusItem(){
        this.menu_items.push(new MCBMainMenuItem("img-status", 'status', 'STATUS', this.getActiveValue(['status'])));
    }
    
    private addSchedulerItem(){
        this.menu_items.push(new MCBMainMenuItem("img-scheduler", 'scheduler', 'SCHEDULER', this.getActiveValue(['scheduler'])));
    }
    
    private addBoostItem(){
        this.menu_items.push(new MCBMainMenuItem("img-boost", 'boost', 'BOOST_TIMER', this.getActiveValue(['boost'])));
    }
    
    private addNightCoolingItem(){
        this.menu_items.push(new MCBMainMenuItem("img-cool", 'night_cooling', 'NIGHT_COOLING', this.getActiveValue(['night_cooling'])));
    }
    
    public addTimeItem(){
        this.menu_items.push(new MCBMainMenuItem("img-time", 'time', 'DATE_TIME', this.getActiveValue(['time'])));
    }
    
    private addFilterResetItem(){
        this.menu_items.push(new MCBMainMenuItem("img-filter", 'filter_reset', 'FILTERS_TIMER', this.getActiveValue(['filter_reset'])));
    }

    private addEconomyItem(){
        this.menu_items.push(new MCBMainMenuItem("img-economy", 'economy', 'ECONOMY_MODE', this.getActiveValue(['economy'])));
    }
    
    private addBuildingProtectionItem(){
        this.menu_items.push(new MCBMainMenuItem("img-building_protection", 'building_protection', 'BUILDING_PROTECTION', this.getActiveValue(['building_protection'])));
    }
    
    private addHeatingItem(){
        this.menu_items.push(new MCBMainMenuItem("img-heating", 'heating_season', 'HEATING_SEASON', this.getActiveValue(['heating_season'])));
    }
    
    private addCO2LevelItem(){
        let item = new MCBMainMenuItem("img-co2", 'co2_level', 'CO2_LEVEL', this.getActiveValue(['co2_level']));
        
        let sub = this.register_service.get('COILS_128').subscribe(register => {
            this.coils_active = +register.value > 0;
            item.visible = this.coils_active && this.ir_active;
        });
        
        let sub1 = this.register_service.get('IR_25').subscribe(register => {
            this.ir_active = +register.value > 0;
            item.visible = this.coils_active && this.ir_active;
        });
        
        this.addSubscriptionToList(sub);
        this.addSubscriptionToList(sub1);
        this.menu_items.push(item);
    }
    
    private addHumidityItem(){
        this.menu_items.push(new MCBMainMenuItem("img-humidity", 'humidity', 'HUMIDITY', this.getActiveValue(['humidity'])));
    }
    
    private addOtherItem(){
        this.menu_items.push(new MCBMainMenuItem("img-other", 'other', 'OTHER', this.getActiveValue(['other'])));
    }
 
    private getActiveValue(url: string[]) : string {
        for (let i = 0; i < url.length; i++) {
            if (url[i] == this.router.url) {
                return "active";
            }
        }
        
        return "";
    }
    
    private subscribeRouteChangedEvent(){
        let sub = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.rebuild();
            }
        });
        
        this.addSubscriptionToList(sub);
    }
    
    private addSubscriptionToList(sub: Subscription){
        this.subs.push(sub);
    }

};