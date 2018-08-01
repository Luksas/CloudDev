import { Component } from '@angular/core';
import { DeviceService } from '../../services/DeviceService';
import { TemperatureHistoryService, TemperatureHistoryInput } from '../../services/TemperatureHistoryService';
import { LineChartData } from '../../data/LineChartData';
import { BaseMonitoring } from './BaseMonitoringComponent'

@Component({
    selector: 'TemperatureHistoryComponent',
    template: `
    
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-heading">
                        {{ 'GRAPH_SETTINGS' | translate }}
                    </div>

                    <div class="panel-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-12">
                                     {{'SELECT_AHU' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <select [disabled]='selection_disabled' class="form-control" (change)="changeAirHandlingUnit($event.target.value)">
                                        <option value="-1">-</option>
                                        <option *ngFor="let slave of slaves" value="{{ slave.id }}" >{{ slave.ahu_name }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-12">
                                     {{'SELECTION_MODE' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <select [disabled]='selection_disabled' class="form-control" (change)="selectionModeChange($event.target.value)">
                                        <option selected value="0">{{ 'TIME' | translate }}</option>
                                        <option value="1">{{ 'RANGE' | translate }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div *ngIf="history_settings.selection_mode == 0" class="form-group">
                            <div class="row">
                                <div class="col-md-12">
                                     {{'TIME_MODE' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <select [disabled]='date_selection_disabled' class="form-control" (change)="changeMode($event.target.value)">
                                        <option value="daily">{{ 'DAILY' | translate }}</option>
                                        <option value="weekly">{{ 'WEEKLY' | translate }}</option>
                                        <option value="monthly">{{ 'MONTHLY' | translate }}</option>
                                        <option value="quarter">{{ 'QUARTER' | translate }}</option>
                                        <option value="yearly">{{ 'YEARLY' | translate }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        
                        
                        <div *ngIf="history_settings.selection_mode == 1" class="form-group">
                            <div class="row">
                                <div class="col-md-offset-3 col-md-6">
                                     {{'START_DATE' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-offset-3 col-md-6">
                                    <input [disabled]='selection_disabled' [(ngModel)]="history_settings.start_date" (change)="reload()" style="color: black;" class="form-control" type="date" />
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-offset-3 col-md-6">
                                    {{'END_DATE' | translate }}
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-offset-3 col-md-6">
                                    <input [disabled]='selection_disabled' [(ngModel)]="history_settings.end_date" (change)="reload()" style="color: black;" class="form-control" type="date" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <line-chart [data]='slave_data' style="display: block"></line-chart>
            </div>
        </div>
    `
})

export class TemperatureHistoryComponent extends BaseMonitoring {
    
    selection_disabled: boolean;
    date_selection_disabled: boolean;
    last_slave_id: number = -1;
    
    history_settings: TemperatureHistoryInput;

    constructor(protected device_service: DeviceService, private temperature_service: TemperatureHistoryService) {
        super(device_service);
        
        this.history_settings = new TemperatureHistoryInput();
        this.history_settings.mode = 'daily';
        this.history_settings.selection_mode = 0;
    }
    
    ngOnInit(){
        this.initialiseDeviceList();
    }
    
    changeAirHandlingUnit(selected_slave_id: number){
        this.history_settings.slave_id = selected_slave_id;
        this.last_slave_id = selected_slave_id;
        this.reload();
    }
    
    reload(){
        this.disableSelectBox();
        this.enableSelectBoxAfterOneSecond();
        this.temperature_service.getTemperatureHistory(this.history_settings).subscribe(response => {
            this.slave_data = response.data as LineChartData;
            this.loadPossibleDates(this.history_settings.slave_id);
        });
    }
    
    selectionModeChange(index: number){
        this.history_settings.selection_mode = index;
    }
    
    changeMode(mode: string){
        this.history_settings.mode = mode;
        this.changeAirHandlingUnit(this.last_slave_id);
    }
    
    private disableSelectBox(){
        this.selection_disabled = true;
        this.date_selection_disabled = true;
    }
    
    private enableSelectBoxAfterOneSecond(){
        setTimeout(() => {
            this.selection_disabled = false;
            this.date_selection_disabled = false;
        }, 1000);
    }
    
};