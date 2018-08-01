import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { MenuItem } from './MenuItem';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'menu',
    templateUrl: './MenuWidgetView.html',
    styleUrls: ['./MenuWidget.css'],
})

export class MenuWidgetComponent implements OnInit {
    
    url: string;
    menu: MenuItem[];
    profile: MenuItem[];
    
    constructor(public auth_service: AuthService, private router: Router) {
        this.subscribeRebuildMenuEvent();
    }
    
    ngOnInit(){
        this.buildMenu();
    }
    
    private buildMenu(){
        this.menu = [];
        this.profile = [];
        
        if (this.auth_service.getAccount().isGuest()) {
            this.addHomeItem();
            this.addDevicesItem();
            this.addAnalyticsItem();
            //if (this.auth_service.getAccount().isAdmin()) {
                
            //}
            
            this.addProfileItem();
        }
    }
    
    private addProfileItem(){
        this.profile.push(new MenuItem({
            label: "ACCOUNT",
            href: "#account",
            active: this.getActiveValue(['/account_settings', '/device_settings', '/device_registration', '/logout']),
            children: [
                new MenuItem({
                    label: "SETTINGS",
                    href: "#account_settings",
                    active: "",
                    children: null
                }),
                new MenuItem({
                    label: "DEVICE_SETTINGS",
                    href: "#device_settings",
                    active: "",
                    children: null
                }),
                new MenuItem({
                    label: "DEVICE_REGISTRATION",
                    href: "#device_registration",
                    active: "",
                    children: null
                }),
//                new MenuItem({
//                    label: "DASHBOARD_CUSTOMIZATION",
//                    href: "#dashboard_settings",
//                    active: "",
//                    children: null
//                }),
                new MenuItem({
                    label: "LOGOUT",
                    href: "#logout",
                    active: "",
                    children: null
                })
            ]
        }));
    }
    
    private addHomeItem() {        
        this.menu.push(new MenuItem({
            label: "DASHBOARD",
            href: "#home",
            active: this.getActiveValue(['/home']),
            children: null
        }));
    }
    
    private addDevicesItem() {
        this.menu.push(new MenuItem({
            label: "DEVICES",
            href: "#devices",
            active: this.getActiveValue(['/devices']),
            children: null
        }));
    }
    
    private addAnalyticsItem(){
        this.menu.push(new MenuItem({
            label: "ANALYTICS",
            href: "",
            active: this.getActiveValue(['/temperature_history', '/alarm_history', '/real_time_monitor']),
            children: [
                new MenuItem({
                    label: "TEMPERATURE_HISTORY",
                    href: "#temperature_history",
                    active: "",
                    children: null
                }),
                new MenuItem({
                    label: "ALARM_HISTORY",
                    href: "#alarm_history",
                    active: "",
                    children: null
                })
//                new MenuItem({
//                    label: "REAL_TIME_MONITOR",
//                    href: "#real_time_monitor",
//                    active: "",
//                    children: null
//                })
            ]
        }));
    }
    
    private subscribeRebuildMenuEvent(){
        this.url = this.router.url;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.url = event.url;
                this.buildMenu();
            }
        });
    }
    
    private getActiveValue(url: string[]) : string {
        for (let i = 0; i < url.length; i++) {
            if (url[i] == this.url) {
                return "active";
            }
        }
        
        return "";
    }
    
};