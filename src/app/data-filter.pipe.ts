import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(data: Array<any>, fields: Array<any>): any {
    // Return the data that has a corresponding field
    return data.filter((e, i) => fields[i]);
  }
}