import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { routerTransition } from './animations/routerTransition';

@Component({
    //animations: [ routerTransition ],
    selector: 'app-root',
    template: `
        <div class="container" >
            <menu style="margin: 0; padding: 0;"></menu>
            
            <div>
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})

//[@routerTransition]="getState(o)"
//#o="outlet"

export class AppComponent {
    
    constructor(private translator: TranslateService, private cookies: CookieService) {
        this.translator.setDefaultLang('en');
        
        let language = this.cookies.get('language');
        
        if (language == '') {
            language = 'en';
        }
        
        this.translator.use(language);
    }
    
//    getState(outlet) {
//        return outlet.activatedRouteData.state;
//    }
    
}
