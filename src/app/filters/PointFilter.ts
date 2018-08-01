import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'point',
    pure: false
})

export class PointFilter implements PipeTransform {
    transform(item: number, part: string): any {
        if (part === 'after') {
            if (Math.round((item % 1) * 10) !== 0) {
                if (!isNaN((item % 1) * 10)) {
                    return '.' + Math.abs(Math.round((item % 1) * 10));
                }
            }
            return '.0';
        }

        if (part === 'before') {
            if (!isNaN(item - item % 1)) {
                return item - item % 1;
            }
        }
    }
}


