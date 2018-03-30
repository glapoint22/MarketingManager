import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featuredFilter'
})
export class FeaturedFilterPipe implements PipeTransform {

  transform(items: Array<any>, isFeatured: boolean): any {
    if (!items) return;
    if (!isFeatured) return items;
    return items.filter(x => x.featured);
  }
}
