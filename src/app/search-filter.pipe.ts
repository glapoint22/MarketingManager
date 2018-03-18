import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: Array<any>, searchValue: string, targetTier: number, tier: number): any {
    if (!items) return;

    if (tier == targetTier && searchValue.length > 0) {
      let searchArray = searchValue.toLowerCase().split(/(?=\s)/g);
      return items.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y)))).slice(0, 50);
    } else {
      return items;
    }


  }

}
