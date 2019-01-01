import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tierFilter'
})
export class TierFilterPipe implements PipeTransform {

  transform(items: Array<any>, id: number): any {
    if (!items) return;
    if (id !== undefined) {
      return items.filter(x => x.parentId == id);
    } else {
      return items;
    }
  }
}