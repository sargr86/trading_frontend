import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';

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
    showFilters = false;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
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

        this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        });
    }

    getAllVideosByAuthors() {
        this.subscriptions.push(this.videoService.getVideosByAuthor({}).subscribe(dt => {
            this.watchlistVideos = dt;
        }));
    }

    getFilteredVideos(e) {
        this.subscriptions.push(this.videoService.getVideosByAuthor({filters: JSON.stringify(e)}).subscribe(dt => {
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
