import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(products: any, term: any): any {
    if (term === undefined) {
      return products;
    }
    return products.filter(function(product) {
      return product.name.toLowerCase().includes(term.toLowerCase());
    });
  }

}
