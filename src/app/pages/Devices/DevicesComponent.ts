import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../services/DeviceService';
import { RegisterDataService } from '../../services/RegisterDataService';
import { AirHandlingUnit } from '../../data/AirHandlingUnit';
import { Gateway } from '../../data/Gateway';

@Component({
    selector: 'DevicesComponent',
    templateUrl: './DevicesComponent.html',
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

export class DevicesComponent implements OnInit {
    
    /**
     * Possible gateways for given user to view.
     * If user is admin, he will be able to see all user gateways.
     */
    gateways: Gateway[];
    
    /**
     * Selected air handling unit list (gateway slave list)
     */
    air_handling_units: AirHandlingUnit[];
    
    /**
     * When this flag is true, shows full list of current users possible to see air handling units.
     */
    show_all: boolean = true;
    
    /**
     * Show/hide loader flag.
     */
    show_loader: boolean = true;
    
    constructor(private device_service: DeviceService, private route: ActivatedRoute, private router: Router, private register_service: RegisterDataService) {}
    
    ngOnInit(){
        this.loadGateways();
        this.loadAllCurrentUserSlaves();
    }
    
    selectDevice(gateway_id: string){
        this.setActiveGateway(gateway_id);
        
        if (this.showAllSlaves(gateway_id)) {    
            return this.loadAllCurrentUserSlaves();
        }

        this.loadSlavesByGatewayId(gateway_id);
    }
    
    goToVentilationControl(air_handling_unit: AirHandlingUnit){
        this.register_service.stop();
        this.register_service.loadAirHandlingUnit(air_handling_unit);
        this.register_service.cleanRegisters();
        this.register_service.poll();
        this.router.navigate(['mcbhome']);
    }
    
    private setActiveGateway(gateway_id: string){
        this.show_all = this.showAllSlaves(gateway_id);
        
        for (let i = 0; i < this.gateways.length; i++) {
            this.gateways[i].active = false;
            if (this.gateways[i].id == +gateway_id && gateway_id != '') {
                this.gateways[i].active = true;
            }
        }
    }
    
    private loadGateways(){
        this.device_service.getDeviceList().subscribe(response => {
            if (!response.hasErrors()) {
                this.gateways = response.response;
            }
        });
    }
    
    private loadSlavesByGatewayId(gateway_id: string){
        this.show_loader = true;
        this.device_service.getSlaveListByGatewayID(gateway_id).subscribe(response => {
            this.show_loader = false;
            if (response.hasErrors()) {
                return;
            }
            
            this.air_handling_units = response.response as AirHandlingUnit[];
        });
    }
    
    private loadAllCurrentUserSlaves(){
        this.show_loader = true;
        this.device_service.getCurrentUserSlavesList().subscribe(response => {
            this.show_loader = false;
            if (response.hasErrors()) {
                return;
            }
            
            this.air_handling_units = response.response as AirHandlingUnit[];
        });
    }
    
    private showAllSlaves(gateway_id: string){
        return gateway_id == '';
    }
    
};