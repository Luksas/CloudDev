import { Component, OnInit, Input } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { MCBHomeItem } from '../../data/MCBHomeItem';

@Component({
    selector: 'mcbhomemenublock',
    styleUrls: ['./MCBHomeMenuBlock.css'],
    template: `
        <div class="item" *ngIf="visible" [ngClass]="item_class">
            <div class="top">
                <div class="img">
                    <div class="{{ iitem.image }}"></div>
                </div>


                <div class="value" *ngIf="iitem.point && iitem.value_key != ''">
                    {{ value| point:'before' }}<span class="point" data-ng-if="point">{{ value | point:'after' }}</span>
                </div>

                <div class="value" *ngIf="!iitem.point && iitem.value_key != ''">
                    {{ value }}
                </div>
            </div>

            <div class="caption">
                {{ iitem.name | translate }}
            </div>
        </div>
    `
})

export class MCBHomeMenuBlock implements OnInit {
    
    iitem: MCBHomeItem;
    
    sub1: any;
    sub2: any;
    
    @Input()
    item_class: string = "";
    
    
    value: string;
    visible: boolean = true;

    constructor(private service: RegisterDataService) {}
    
    ngOnInit(){
        this.subscribeValueChangedEvent();
        this.subscribeVisibilityChangedEvent();
    }
    
    @Input() 
    set item(item: MCBHomeItem){
        this.iitem = item;
//        
//        this.sub1.unsubscribe();
//        this.sub2.unsubscribe();
        
        this.subscribeValueChangedEvent();
        this.subscribeVisibilityChangedEvent();
    }
    
    private subscribeValueChangedEvent(){
        if (this.iitem.value_key != "") {
            this.service.get(this.iitem.value_key).subscribe(register => {
                if (this.iitem.coef != 1) {
                    return this.value = (+register.value / this.iitem.coef).toString();
                }
                
                this.value = register.value;
            });
        }
    }
    
    private subscribeVisibilityChangedEvent(){
        if (this.iitem.visible_key != "") {
            this.service.get(this.iitem.visible_key).subscribe(register => {
                this.visible = +register.value > +this.iitem.show_when;
            });
        }
    }
    
};