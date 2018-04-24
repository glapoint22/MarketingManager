import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(items: Array<any>): any {
    return items.sort((a, b) => {
      if (a.data[0].value.toLowerCase() > b.data[0].value.toLowerCase()) return 1;
      if (a.data[0].value.toLowerCase() < b.data[0].value.toLowerCase()) return -1;
    })
  }
}
