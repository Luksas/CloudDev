import { Component, Input, OnInit } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';
import { Register } from '../../data/Register';

@Component({
    selector: 'onoff-widget',
    templateUrl: './OnOffWidgetComponent.html',
    styleUrls: ['./OnOffWidgetComponent.css']
})

export class OnOffWidgetComponent implements OnInit {
    
    @Input() 
    modbus_key: string;
    
    @Input() 
    image: string;
    
    @Input() 
    image_off: string = "";
    
    @Input() 
    text: string = "";
    
    @Input()
    value: number = 1;
    
    @Input()
    reverse: boolean = false;
    
    image_shown: string;
    active_class: string = "";
    register: Register;

    constructor(private register_data_service: RegisterDataService) {}
    
    ngOnInit(){
        this.register_data_service.get(this.modbus_key).subscribe(register => {
            this.register = register;
            this.updateActiveClass();
            this.changeImageValue();
        });
    }
    
    trigger(){
        // Execute the trigger
        this.isActive() ? this.disable() : this.activate();
        
        // Refresh the image and class
        this.register_data_service.next(this.register);
        this.updateActiveClass();
        this.changeImageValue();
    }
    
    private isActive(){
        let active = (+this.register.value >= +this.value);
        
        return this.reverse ? !active : active;
    }
    
    private activate(){
        if (this.reverse) {
            this.register.value = "0";
        }else{
            this.register.value = this.value.toString();
        }
    }

    private disable(){
        if (this.reverse) {
            this.register.value = this.value.toString();
        }else{
            this.register.value = "0";
        }
    }
    
    private updateActiveClass(){
        if (this.isActive()) {
            this.active_class = "b-active";
            return;
        }
        
        this.active_class = "";
    }
    
    private changeImageValue(){
        if (this.image_off == "") {
            this.image_shown = this.image;
        }
        
        this.isActive() ? this.image_shown = this.image : this.image_off;
    }
    
};