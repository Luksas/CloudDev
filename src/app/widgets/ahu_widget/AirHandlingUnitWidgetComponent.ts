import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DeviceService } from '../../services/DeviceService';
import { AirHandlingUnit } from '../../data/AirHandlingUnit';

@Component({
    selector: 'ahu-widget',
    template: `
        <div style="width: 100%;">

            <div class="block" style="width: 30%;">
                <input type="text" class="form-control" [(ngModel)]="ahu.ahu_name" />
            </div>
            
            <div class="block" style="width: 30%;">
                <input type="text" class="form-control" [(ngModel)]="ahu.board_address" />
            </div>

            <div class="block">
                <button (click)="remove()" type="button" class="btn btn-primary">
                    <span class="glyphicon glyphicon-trash"></span> {{ 'DELETE' | translate }}
                </button>
                
                <button (click)="save()" type="button" class="btn btn-primary">
                    <span class="glyphicon glyphicon-trash"></span> {{ 'SAVE' | translate }}
                </button>
            </div>

        </div>
    `,
    styles: [`
        .block {
            float: left;
            width: 40%;
        }
    `]
})

export class AirHandlingUnitWidgetComponent implements OnInit {
    
    // Callback
    @Output() onSuggest: EventEmitter<any> = new EventEmitter();
    
    @Input()
    ahu: AirHandlingUnit;

    constructor(private device_service: DeviceService) {}
    
    ngOnInit(){}
    
    remove(){
        this.device_service.deleteSlave(this.ahu.id).subscribe((response) => {
            if (response.hasErrors()) {
                alert(response.getErrorMessage());
            }else{
                alert('SAVED');
            }
            
            
            this.onSuggest.emit();
        });
    }
    
    save(){
        this.device_service.updateSlave(this.ahu).subscribe((response) => {
            if (response.hasErrors()) {
                alert(response.getErrorMessage());
            }else{
                alert('SAVED');
            }
            
            this.onSuggest.emit();
        });
    }
    
};