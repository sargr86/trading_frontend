import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-videos-tab',
    templateUrl: './videos-tab.component.html',
    styleUrls: ['./videos-tab.component.scss']
})
export class VideosTabComponent implements OnInit {

    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;

    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private videoService: VideoService
    ) {
    }

    ngOnInit(): void {
    }

    getSearchResults(dt) {
        this.channelUser.videos = dt;
    }

}
