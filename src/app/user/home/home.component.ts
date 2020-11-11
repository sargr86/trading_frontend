import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    owlOptions = OWL_OPTIONS;
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

    openVideoPage(video, username) {

    }

}
