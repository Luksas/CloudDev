import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';

import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/DeviceService';
import { Gateway } from '../../data/Gateway';
import { AirHandlingUnit } from '../../data/AirHandlingUnit';

@Component({
    selector: 'MyDevicesComponent',
    templateUrl: './MyDevicesComponent.html',
    styles: [`
        .large-screen {
            display: block;
        }
        
        .small-screen {
            display: none;
        }
        
        .active {
            background-color: #080808;
        }
        
        .rotate {
            transform:rotate(45deg);
            transition-duration:1s;
        }
    
        @media (max-width: 480px) {
            .large-screen {
                display: none;
            }
            
            .small-screen {
                display: block;
            }
        }
    `]
})

export class MyDevicesComponent implements OnInit {
    
    /**
     * Possible gateways for given user to view.
     * If user is admin, he will be able to see all user gateways.
     */
    gateways: Gateway[];
    i :number;
    active_gateway: Gateway;
    
    active_index: number = 0;
    
    @ViewChild('selected_element') input_field: ElementRef;

    constructor(
        private auth_service: AuthService, 
        private router: Router, 
        private device_service: DeviceService
        ) {}
     
    ngOnInit(){
        this.loadGateways();
    }
    
    selectDevice(new_active_index: number){
        this.gateways[this.active_index].active = false;
        this.loadActiveDeviceIfPossible(new_active_index);
    }
    
    renameClickEvent(){
        
    }
    
    renameGateway(){
        this.input_field.nativeElement.removeAttribute('disabled');
        this.input_field.nativeElement.focus();
    }
    
    addSlave(){
        // Create data item for ahu widget
        var slave = new AirHandlingUnit();
        slave.id = -1;
        slave.gateway_id = this.active_gateway.id;
        slave.ahu_name = '---';
        slave.board_address = this.active_gateway.getUniqueSlaveAddress();
        
        // add the widget to rendering list.
        this.active_gateway.slaves.push(slave);
    }

    private loadGateways(){
        this.gateways = [];

        this.device_service.getDeviceList().subscribe(response => {
            if (!response.hasErrors()) {
                this.gateways = response.response;
                this.loadActiveDeviceIfPossible(this.active_index);
            }
        });
    }
    
    private loadActiveDeviceIfPossible(index: number){
        if (this.gateways[index] !== undefined) {
            this.gateways[index].active = true;
            this.active_index = index;
            
            let gateway = new Gateway();
            gateway.id = this.gateways[index].id;
            gateway.name = this.gateways[index].name;
            gateway.mac = this.gateways[index].mac;
            gateway.status_id = this.gateways[index].status_id;
            gateway.active= this.gateways[index].active;
            gateway.slaves = this.gateways[index].slaves;
            
            this.active_gateway = gateway;
        }
    }
    
};