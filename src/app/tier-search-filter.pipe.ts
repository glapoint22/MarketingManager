import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tierSearchFilter'
})
export class TierSearchFilterPipe implements PipeTransform {

  transform(items: Array<any>, searchValue: string, targetTier: number, tier: number): any {
    if (!items) return;

    if (tier == targetTier && searchValue.length > 0) {
      let searchArray = searchValue.toLowerCase().split(/(?=\s)/g);
      return items.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y))));
    } else {
      return items;
    }
  }
}