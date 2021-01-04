import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

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
    subscriptions: Subscription[] = [];

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
        this.subscriptions.push(this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        }));
    }

    getSearchResults(search) {
        this.search = search;
        this.subscriptions.push(this.videoService.searchInVideosByAuthor({search}).subscribe(dt => {
            this.watchlistVideos = dt;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
