import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tierFilter'
})
export class TierFilterPipe implements PipeTransform {

  transform(items: Array<any>, id: number, change: number): any {
    if (!items) return;
    if (id) {
      return items.filter(x => x.parentId == id && !x.isDeleted);
    } else {
      return items.filter(x => !x.isDeleted);
    }
  }
}
