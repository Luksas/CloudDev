import { Component } from '@angular/core';

@Component({
    selector: 'MCBHomeComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
        
            <table class="mcb-page">
                <tr>
                    <td></td>
                </tr>
            </table>
        
            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBMainMenuComponent {
        
    constructor() {}
    
};