import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterOutFalsyValuesFromObject'
})
export class FilterOutFalsyValuesFromObjectPipe implements PipeTransform {

    transform(params, projectSpecific = true): unknown {
        // console.log(params.filters)
        if (projectSpecific) {
            params = {
                search: params.search,
                filters: (params.filters ? JSON.stringify(params.filters) : null),
                tag: params.tag
            };
        }
// console.log(params)

        return Object.entries(params).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {});
    }

}
