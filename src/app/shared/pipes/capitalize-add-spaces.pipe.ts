import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeAddSpaces'
})
export class CapitalizeAddSpacesPipe implements PipeTransform {

    transform(col: string, ...args: unknown[]): string {
        col = `${col?.[0]?.toUpperCase()}${col.slice(1)}`.replace(/([A-Z])/g, ' $1').trim()|| '';
        return col.replace(/_/g, ' ');
    }

}
