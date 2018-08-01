import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterDataService } from '../../services/RegisterDataService';

@Component({
    selector: 'mcb-header',
    templateUrl: './MCBHeaderWidget.html',
    styleUrls: ['./MCBHeaderWidget.css']
})

export class MCBHeaderWidget implements OnInit, OnDestroy {
        
    in_first: boolean = false;
    path: any[];
    
    // 4 ---- holding register (3)
    // 5 ---- coil (1)
    // 6 ---- discrete input (2)
    // 7 ---- input register (4)
    constructor(private data_service: RegisterDataService, private active_route: ActivatedRoute, private router: Router) {}
    
    back(){
        // Go to prev!
        this.goTo(this.path[this.path.length - 1].href);
    }
    
    goTo(path: string){
        this.router.navigate([path]);
    }
    
    ngOnInit(){        
        this.subscribeRouteDataChangedEvent();
        this.data_service.start();
    }
    
    ngOnDestroy(){
        this.data_service.stop();
    }
    
    private subscribeRouteDataChangedEvent(){
        this.active_route.data.subscribe(path => {
            this.path = path.path as any[];           
            this.in_first = this.path.length == 1;
        });
    }
    
};