import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tierFilter'
})
export class TierFilterPipe implements PipeTransform {

  transform(items: Array<any>, id: number): any{
    if(id){
      return items.filter(x => x.parentId == id);
    }else{
      return items;
    }
  }
}
