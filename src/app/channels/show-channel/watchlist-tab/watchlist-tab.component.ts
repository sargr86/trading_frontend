import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    watchlistVideos = [];
    owlOptions: OwlOptions = OWL_OPTIONS;
    apiUrl = API_URL;
    search;

    constructor(
        private videoService: VideoService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.watchlistVideos = [];
        this.search = localStorage.getItem('search');
        if (!this.search) {
            this.getAllVideosByAuthors();
        } else {
            this.getSearchResults(this.search);
        }
    }

    getAllVideosByAuthors() {
        this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

    openVideoPage(video, username) {
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

    getSearchResults(search) {
        this.search = search;
        this.videoService.searchInVideosByAuthor({search}).subscribe(dt => {
            this.watchlistVideos = dt;
        });
    }

    ngOnDestroy() {
    }

}
