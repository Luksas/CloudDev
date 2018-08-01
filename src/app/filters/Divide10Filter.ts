import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'divide10',
    pure: false
})

export class Divide10Filter implements PipeTransform {
    transform(value: number): any {
        return value / 10;
    }
}