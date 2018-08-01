import { Component } from '@angular/core';
import { DeviceService } from '../../services/DeviceService';
import { AlarmHistoryService } from '../../services/AlarmHistoryService';
import { BaseMonitoring } from './BaseMonitoringComponent'

@Component({
    selector: 'AlarmHistoryComponent',
    template: `
        <div class="row black" >
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-heading">
                        {{ 'SELECT_AHU' | translate }}
                    </div>

                    <div class="panel-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-12">
                                    <select [disabled]='selection_disabled' class="form-control" (change)="changeAirHandlingUnit($event.target.value)">
                                        <option value="-1">-</option>
                                        <option *ngFor="let slave of slaves" value="{{ slave.id }}" >{{ slave.ahu_name }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row black" *ngIf="table_visibile">
            <div class="col-md-offset-3 col-md-6">
                <div class="panel black border-white">
                    <div class="panel-body">
                        <div class="form-group">
                            <table style="width: 100%;">
                                <tr>
                                    <th>{{ 'DATE' | translate }} </th>
                                    <th>{{ 'COUNT' | translate }} </th>
                                </tr>
                                
                                <tr *ngFor="let alarm of currentPageAlarms" (click)="triggerAlarmsInfo(alarm)">
                                    <td>
                                        {{ alarm.date }}
                                        
                                        <div *ngIf="alarm.shown">
                                            <div style="color:red; " *ngFor="let message of alarm.alarm_array">{{ 'DI_' + message | translate }}</div> 
                                        </div>
                                    </td>
                                    <td>{{ alarm.count }}</td>
                                </tr>
                                
                            </table>
                        </div>
                        
                        <div class="form-group">
                            <div (click)="prev()" style="float: left;">
                                <button class="btn btn-primary"> {{ 'PREV' | translate }}</button>
                            </div>
                            <div (click)="next()" style="float: right;">
                                <button class="btn btn-primary"> {{ 'NEXT' | translate }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class AlarmHistoryComponent extends BaseMonitoring {
    
    selection_disabled: boolean;    
    last_slave_id: number = -1;
    alarms: Alarms[]; 
    table_visibile: boolean = false;
    
    page: number = 0;
    rows_per_page: number = 5;
    currentPageAlarms: Alarms[];

    constructor(protected device_service: DeviceService, private alarm_history_service: AlarmHistoryService) {
        super(device_service);
    }
    
    ngOnInit(){
        this.initialiseDeviceList();
    }
    
    changeAirHandlingUnit(selected_slave_id: number){
        this.disableSelectBox();
        this.last_slave_id = selected_slave_id;

        this.alarm_history_service.getAlarmHistory(selected_slave_id).subscribe(response => {
            this.alarms = response.data as Alarms[];
            this.table_visibile = this.alarms.length > 0;
            this.loadPages();
            this.enableSelectBoxAfterOneSecond();
        });
    }
    
    triggerAlarmsInfo(alarm: Alarms){
        if (alarm.alarm_array !== undefined && alarm.alarm_array.length > 0) {
            alarm.alarm_array = [];
            alarm.shown = false;
        } else {
            alarm.alarm_array = alarm.alarms.split(';');
            alarm.shown = true;
        }
    }
    
    next(){
        if (this.alarms.length / this.rows_per_page <= this.page + 1) {
            return;
        }
        
        this.page++;
        this.loadPages();
    }
    
    prev(){
        if (this.page == 0) {
            return;
        }
        
        this.page--;
        this.loadPages();
    }
    
    private loadPages(){
        this.currentPageAlarms = [];
        
        for (let i = this.page * this.rows_per_page; i < this.rows_per_page + (this.page * this.rows_per_page); i++) {
            if (i == this.alarms.length) {
                return;
            }
            
            this.currentPageAlarms.push(this.alarms[i]);
        }
    }
    
    private disableSelectBox(){
        this.selection_disabled = true;
    }
    
    private enableSelectBoxAfterOneSecond(){
        setTimeout(() => {
            this.selection_disabled = false;
        }, 1000);
    }
    
};

export class Alarms {
    alarms: string;
    alarm_array: string[] = [];
    shown: boolean = true;
    count: number;
    date: string; 
};