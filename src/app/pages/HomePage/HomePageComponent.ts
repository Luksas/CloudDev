import { Component, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';


@Component({
    selector: 'Home',
    template: `
        <div class="row">
            <div class="col-md-12">
                <h2>Welcome to SALDA cloud</h2>
            </div>
        </div>
    `
})

export class HomePageComponent implements OnInit {
    
    constructor(private register_data_service: RegisterDataService) {}
    
    ngOnInit(){
        
    }
    
};