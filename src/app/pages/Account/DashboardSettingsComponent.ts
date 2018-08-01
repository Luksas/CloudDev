import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
    selector: 'DashboardSettingsComponent',
    template: `
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-heading">
                        {{ 'DASHBOARD_SETTINGS' | translate }}
                    </div>

                    <div class="panel-body">
                        <div class="row">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class DashboardSettingsComponent implements OnInit {
    
    constructor(private auth_service: AuthService, private router: Router) {}
    
    ngOnInit(){}
    
};