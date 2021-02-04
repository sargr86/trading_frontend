import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkForEmptyObject'
})
export class CheckForEmptyObjectPipe implements PipeTransform {

  transform(obj: unknown): unknown {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

}
