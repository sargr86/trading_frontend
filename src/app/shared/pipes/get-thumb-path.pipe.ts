import {Pipe, PipeTransform} from '@angular/core';
import {
    API_URL,
    VIDEO_DEFAULT_AVATARS_PATH,
    VIDEO_DEFAULT_COVERS_PATH,
    VIDEO_DEFAULT_THUMBNAILS_PATH
} from '@core/constants/global';

@Pipe({
    name: 'getImgPath'
})
export class GetThumbPathPipe implements PipeTransform {

    transform(img, folder = 'thumbnails'): string {
        return img ? `${API_URL}uploads/${folder}/${img}` : this.getDefaultPaths(folder);
    }

    getDefaultPaths(folder) {
        let p = '';
        switch (folder) {
            case 'thumbnails':
                p = VIDEO_DEFAULT_THUMBNAILS_PATH;
                break;
            case 'avatars':
                p = VIDEO_DEFAULT_AVATARS_PATH;
                break;
            case 'covers':
                p = VIDEO_DEFAULT_COVERS_PATH;
        }

        return p;

    }

}
