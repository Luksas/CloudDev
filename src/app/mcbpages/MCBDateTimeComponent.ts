import { Component } from '@angular/core';

@Component({
    selector: 'MCBDateTimeComponent',
    template: `
        <div class="mcb-container">
            <mcb-header></mcb-header>
        
            <table class="mcb-page">
                <tr>
                    <td class="bottom" style="text-align: center;">
                        
                    </td>
                </tr>
            </table>

            <mcbmainmenu-widget></mcbmainmenu-widget>
        </div>
    `
})

export class MCBDateTimeComponent {    
};