import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixLineBreaks'
})
export class FixTextLineBreaksPipe implements PipeTransform {

  transform(d: string, replaceValue = '\n'): string {
      // return d?.replace('<br>', '');
      return d?.replace(/<br\s*[\/]?>/gi, replaceValue);
  }

}
