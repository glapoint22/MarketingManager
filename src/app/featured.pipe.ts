import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featured'
})
export class FeaturedPipe implements PipeTransform {

  // transform(items: Array<any>, searchValue: string): any {
  //   let searchArray = searchValue.toLowerCase().split(/(?=\s)/g);
  //   return items.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y))));
  // }

  transform(items: Array<any>, id: number): any{
    if(id){
      return items.filter(x => x.parentId == id);
    }else{
      return items;
    }
    
  }

}
