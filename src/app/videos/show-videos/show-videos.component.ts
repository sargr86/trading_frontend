import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit {
    videos = [];
    apiUrl = API_URL;

    constructor(
        private videoService: VideoService
    ) {
    }

    ngOnInit(): void {
        this.videoService.get({}).subscribe(dt => {
            this.videos = dt;
        });
    }

    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
    }
}
