import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit {
    videos = [];
    apiUrl = API_URL;

    constructor(
        private videoService: VideoService,
        public router: Router
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

    openVideoPage(video, username) {
        console.log(username);
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }
}
