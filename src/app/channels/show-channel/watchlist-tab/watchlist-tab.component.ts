import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit {
    watchlistVideos = [];
    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;

    constructor(
        private videoService: VideoService
    ) {
    }

    ngOnInit(): void {
        this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

}
