import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DeviceService } from '../../services/DeviceService';
import { Gateway } from '../../data/Gateway';

@Component({
    selector: 'DeviceRegistrationComponent',
    templateUrl: './DeviceRegistrationComponent.html',
})

export class DeviceRegistrationComponent implements OnInit {
    
    registration_error: string;
    gateway : Gateway;
    
    constructor(private device_service: DeviceService, private router: Router) {}
    
    ngOnInit(){
        this.gateway = new Gateway();
    }
    
    register(){
        this.device_service.registerDevice(this.gateway.name, this.gateway.mac).subscribe((response) => {
            if (response.hasErrors()) {
                this.registration_error = "Error occured";
                return;
            }
            
            this.router.navigate(['devices']);
        });
    }
    
};