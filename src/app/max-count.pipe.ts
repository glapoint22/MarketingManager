import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxCount'
})
export class MaxCountPipe implements PipeTransform {

  transform(items: Array<any>, count: number): any {
    if (!items) return;
    return items.slice(0, count);
  }
}