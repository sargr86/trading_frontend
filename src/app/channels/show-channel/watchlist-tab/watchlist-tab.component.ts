import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';

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
    @Input('filters') filters = null;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
    }

    ngOnInit(): void {
        this.watchlistVideos = [];
        this.search = localStorage.getItem('search');
        this.getAllVideosByAuthors({search: this.search, filters: this.filters});
        this.getFiltersToggleState();
    }

    getFiltersToggleState() {
        this.subscriptions.push(this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        }));
    }

    getAllVideosByAuthors(params) {
        params = this.getExactParams.transform(params);

        this.subscriptions.push(this.videoService.getVideosByAuthor(params).subscribe(dt => {
            this.watchlistVideos = dt;
        }));
    }

    getFilteredVideos(filters) {
        this.filters = filters;
        this.getAllVideosByAuthors({search: this.search, filters});
    }

    getSearchResults(search) {
        this.search = search;
        console.log('get search results')
        this.getAllVideosByAuthors({search, filters: this.filters});
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
