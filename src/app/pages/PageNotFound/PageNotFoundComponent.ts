import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'PageNotFoundComponent',
    template: `
        <div class="row">
            <div class="col-md-12">
                Page not found!
            </div>
        </div>
    `,
})

export class PageNotFoundComponent implements OnInit {
    
    constructor() {}
    
    ngOnInit(){}
    
};