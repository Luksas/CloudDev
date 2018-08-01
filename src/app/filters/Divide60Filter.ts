import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'divide60',
    pure: false
})

export class Divide60Filter implements PipeTransform {
    transform(value: number): any {
        return value / 60.0;
    }
}