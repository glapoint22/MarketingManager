import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(items: Array<any>): any {
    return items
      .map(x => x.group)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(x => ({
        group: x,
        styles: items.filter(z => z.group === x)
      }));
  }
}