import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'elegantDate'
})
export class GetElegantDatePipe implements PipeTransform {

    transform(date): string {
        date = new Date(date);
        const thisWeekDate = moment(date).isSame(new Date(), 'week');
        let result = moment(date).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');
        const isToday = moment(date).isSame(Date.now(), 'day');
        const isYesterday = moment(date).isSame(moment().subtract(1, 'day'), 'day');

        if (isToday) {
            result = 'Today at ' + moment(date).format('HH:mm');
        } else if (isYesterday) {
            result = 'Yesterday at ' + moment(date).format('HH:mm');
        }

        return result;
    }

}
