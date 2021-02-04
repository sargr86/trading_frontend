import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateFromNow'
})
export class DateFromNowPipe implements PipeTransform {

    transform(datetime): unknown {
        let fromNow = moment(datetime).fromNow();
        if (fromNow === 'a day ago') {
            fromNow = '1 day ago';
        }
        return fromNow;
    }

}
