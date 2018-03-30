import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(data: Array<any>, fields: Array<any>): any {
    return data.filter((e, i) => fields[i]);
  }
}
