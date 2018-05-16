import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: Array<any>, searchValue: string): Array<any> {
    if (!items) return;

    let searchArray = searchValue.toLowerCase().split(' ');
    return items.filter(x => searchArray.every(y => x.data[0].value.toLowerCase().includes(y)));
  }
}