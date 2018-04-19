import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rankFilter'
})
export class RankFilterPipe implements PipeTransform {

  transform(itemPosts: any, term: any): any {
    // check if search term is undefined
    if(term === undefined) return itemPosts;
    // return updated item array
    return itemPosts.filter((item) => {
      return item.title.toLowerCase().includes(term.toLowerCase());
    });
  }

}
