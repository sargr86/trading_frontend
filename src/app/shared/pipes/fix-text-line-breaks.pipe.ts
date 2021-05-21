import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixLineBreaks'
})
export class FixTextLineBreaksPipe implements PipeTransform {

  transform(d: string): string {
      // return d?.replace('<br>', '');
      return d?.replace(/<br\s*[\/]?>/gi, '\n');
  }

}
