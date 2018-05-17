import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deletedFilter'
})
export class DeletedFilterPipe implements PipeTransform {

  transform(items: Array<any>, change: number): Array<any> {
    if (!items) return;
    return items.filter(x => !x.isDeleted);
  }
}