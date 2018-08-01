import { Component, Input } from '@angular/core';
import { StatusItem } from '../../data/StatusItem';

@Component({
    selector: 'mcb-status-widget',
    template: `
        <div [hidden]="item.visible" class="block">
            <div class="full" style="padding-top: 20px;">
                {{ item.desc | translate }}
            </div>
            
            <div class="full">
                {{ item.value }}
            </div>
        </div>
    `,
    styles: [`
        .block {
            float: left;
            width: 200px;
            height: 100px;
            border-radius: 10px;
            border: solid 1px white;
        }
        
        .full {
            width: 100%;
            height: 50%;
        }
    `]
})

export class MCBStatusWidgetComponent {
    
    @Input() item: StatusItem

    constructor() {}
    
};