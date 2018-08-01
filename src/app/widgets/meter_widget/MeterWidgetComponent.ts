import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { RegisterDataService } from '../../services/RegisterDataService';

@Component({
    selector: 'meter-widget',
    template: `
    <div style="float: left; width: 205px;">
        <div *ngIf="text != ''" style="width: 100%; text-align: center;">{{ text | translate }}</div>
        <canvas width='100' height='100' style="margin: 0 auto; display: block;" #canvas></canvas>
    </div>
    `
})

export class MeterWidgetComponent implements OnInit, AfterViewInit  {
    
    @ViewChild('canvas') 
    canvas: ElementRef;
    
    @Input() 
    value_modbus_key: string;
    
    @Input() 
    max_value_modbus_key: string;
    
    @Input()
    text: string = "";
    
    private max: number = 31;
    private value: number = 0;

    constructor(private register_data_service: RegisterDataService) {}
    
    ngOnInit(){
        this.subscribeMaxValueChangedEvent();
        this.subscribeValueChangedEvent();
    }
    
    ngAfterViewInit(){
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        let ctx = canvas.getContext('2d'),
            xcenter = canvas.width / 2,
            ycenter = canvas.height / 2,
            radius = 47,
            startAngle = 1.5 * Math.PI,
            counterClockwise = false,
            //default black theme
            fill = 'rgba(0, 0, 0, 0.4)',
            stroke = 'rgba(134, 195, 39, 1)',
            textFill = 'rgba(255, 255, 255, 1)';
            
            
        this.register_data_service.get(this.value_modbus_key).subscribe(register => {
            this.value = +register.value;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var endAngle = (this.value * (2 * Math.PI) / this.max) + (1.5 * Math.PI);
            ctx.beginPath();
            ctx.arc(xcenter, ycenter, radius + 2.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = fill;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(xcenter, ycenter, radius, startAngle, endAngle, counterClockwise);
            ctx.lineWidth = 5;
            ctx.strokeStyle = stroke;
            ctx.stroke();

            ctx.font = '30px Arial, Helvetica, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textFill;
            ctx.textAlign = 'center';
            ctx.fillText(this.value.toString(), xcenter, ycenter);
        });
    }
    
    private subscribeMaxValueChangedEvent(){
        this.register_data_service.get(this.max_value_modbus_key).subscribe(register => {
            this.max = +register.value;
        });
    }
    
    private subscribeValueChangedEvent(){
        this.register_data_service.get(this.value_modbus_key).subscribe(register => {
            this.value = +register.value;
        });
    }
    
    
};