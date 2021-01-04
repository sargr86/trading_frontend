import {Pipe, PipeTransform} from '@angular/core';
import {API_URL} from '@core/constants/global';

@Pipe({
    name: 'getThumbPath'
})
export class GetThumbPathPipe implements PipeTransform {

    transform(video): string {
        return `${API_URL}uploads/thumbnails/${video?.thumbnail}`;
    }

}
