import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remove_Capitalize'
})
export class LowercaseUnderscored2CapitalizedSpacedPipe implements PipeTransform {

  transform(col: string, ...args: unknown[]): string {
      col = `${col[0].toUpperCase()}${col.slice(1)}`.replace(/([A-Z])/g, ' $1').trim();
      return col.replace(/_/g, ' ');
  }

}
