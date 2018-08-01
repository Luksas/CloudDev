import {trigger, animate, style, group, animateChild, query, stagger, transition, keyframes} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', animate('500ms ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(200%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
    ]))),
    
    
//    transition('* <=> *', [
//
//        query(':enter, :leave', style({position: 'fixed', width: '100%'}), {optional: true}),
//        group([
//            query(':enter', [
//                style({transform: 'translateX(100%)'}),
//                animate('1.0s ease-in-out', style({transform: 'translateX(0%)'}))
//            ], {optional: true}),
//            query(':leave', [
//                style({transform: 'translateX(0%)'}),
//                animate('1.0s ease-in-out', style({transform: 'translateX(-100%)'}))
//            ], {optional: true})
//        ])
//    ])
])