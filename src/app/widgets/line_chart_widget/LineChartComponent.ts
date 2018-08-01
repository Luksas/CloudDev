import {ViewChild, Component, ElementRef, OnInit, Input, OnChanges} from '@angular/core';
import Chart from 'chart.js';
import 'chartjs-plugin-zoom';
import {LineChartData} from '../../data/LineChartData';

@Component({
    selector: 'line-chart',
    template: `
        <canvas #chart></canvas>
    `,
})

export class LineChartComponent implements OnInit, OnChanges {

    @ViewChild('chart')
    chart: ElementRef;
    
    @Input()
    chart_name: string = "";
    
    @Input()
    data: LineChartData = null;
    
    chart_data = {
        type: 'line',
        data: this.data,
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 18
                }
            },
            title: {
                display: this.chart_name != "",
                text: this.chart_name
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        beginAtZero: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        beginAtZero:true
                    }
                }]
            },
            pan: {
                enabled: false,
                mode: 'xy'
            },
            zoom: {
                enabled: false,
                mode: 'xy'
            }
        }
    };
    
    constructor() {}

    ngOnInit() {
        this.render();
    }
    
    ngOnChanges(){
        this.render();
    }

    private render() {
        if (this.data != null) {
            this.chart_data.data = this.data;
            new Chart(this.getCanvas(), this.chart_data);
        }
    }

    private getCanvas() {
        return (this.chart.nativeElement as HTMLCanvasElement).getContext('2d');
    }

};